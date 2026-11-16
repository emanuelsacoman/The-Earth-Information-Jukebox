param(
  [Parameter(Mandatory = $true)][string]$SourcePath,
  [string]$OutputDirectory = (Join-Path $PSScriptRoot '../public/data/globe-night-lights')
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$expectedHash = '2133849546795e5a0a9bcdb9e7457ecf949125d67f51d5862908168b93bcf77a'
if ((Get-FileHash -LiteralPath $SourcePath -Algorithm SHA256).Hash.ToLowerInvariant() -ne $expectedHash) {
  throw 'The source differs from the qualified NASA GeoTIFF.'
}
$source = [System.Drawing.Bitmap]::new((Resolve-Path -LiteralPath $SourcePath).Path)
try {
  if ($source.Width -ne 3600 -or $source.Height -ne 1800) { throw 'Unexpected raster dimensions.' }
  $scaleBytes = $source.GetPropertyItem(33550).Value
  $tieBytes = $source.GetPropertyItem(33922).Value
  $scale = @(0, 8, 16 | ForEach-Object { [BitConverter]::ToDouble($scaleBytes, $_) })
  $tie = @(0, 8, 16, 24, 32, 40 | ForEach-Object { [BitConverter]::ToDouble($tieBytes, $_) })
  $keyBytes = $source.GetPropertyItem(34735).Value
  $keys = @{}
  for ($offset = 8; $offset -lt $keyBytes.Length; $offset += 8) {
    $key = [BitConverter]::ToUInt16($keyBytes, $offset)
    if ([BitConverter]::ToUInt16($keyBytes, $offset + 2) -eq 0) {
      $keys["$key"] = [BitConverter]::ToUInt16($keyBytes, $offset + 6)
    }
  }
  if ($scale[0] -ne 0.1 -or $scale[1] -ne 0.1 -or ($tie -join ',') -ne '0,0,0,-180,90,0' -or
      $keys['1024'] -ne 2 -or $keys['1025'] -ne 1 -or $keys['2048'] -ne 4326 -or $keys['2054'] -ne 9102) {
    throw 'The CRS, PixelIsArea grid or tie point differs from the qualified transform.'
  }
} finally { $source.Dispose() }

# Exact 2x2 encoded-gray block mean. No coastline mask, invented lights,
# cropping, gamma adjustment or calibration is applied to the scientific asset.
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
public static class NightLightsDerivative {
  public static void Create(string sourcePath, string outputPath) {
    using (var source = new Bitmap(sourcePath))
    using (var target = new Bitmap(1800, 900, PixelFormat.Format24bppRgb)) {
      var input = source.LockBits(new Rectangle(0,0,3600,1800), ImageLockMode.ReadOnly, PixelFormat.Format24bppRgb);
      var output = target.LockBits(new Rectangle(0,0,1800,900), ImageLockMode.WriteOnly, PixelFormat.Format24bppRgb);
      try {
        if (input.Stride <= 0 || output.Stride <= 0) throw new Exception("Unexpected bitmap orientation");
        var src = new byte[input.Stride * 1800];
        var dst = new byte[output.Stride * 900];
        Marshal.Copy(input.Scan0, src, 0, src.Length);
        for (int y=0;y<1800;y++) for(int x=0;x<3600;x++) {
          int i=y*input.Stride+x*3;
          if(src[i]!=src[i+1] || src[i]!=src[i+2]) throw new Exception("Source is not encoded grayscale");
        }
        for (int y=0;y<900;y++) for(int x=0;x<1800;x++) {
          int i=y*2*input.Stride+x*6;
          byte mean=(byte)((src[i]+src[i+3]+src[i+input.Stride]+src[i+input.Stride+3]+2)/4);
          int j=y*output.Stride+x*3;
          dst[j]=dst[j+1]=dst[j+2]=mean;
        }
        Marshal.Copy(dst,0,output.Scan0,dst.Length);
      } finally { source.UnlockBits(input); target.UnlockBits(output); }
      target.Save(outputPath,ImageFormat.Png);
    }
  }
}
'@
New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
$outputPath = Join-Path (Resolve-Path -LiteralPath $OutputDirectory).Path 'black-marble-2012.png'
[NightLightsDerivative]::Create((Resolve-Path -LiteralPath $SourcePath).Path, $outputPath)
$manifest = [ordered]@{
  schemaVersion = 1
  id = 'nasa-black-marble-geographic-2012'
  title = 'NASA Earth at Night / Black Marble, 2012 grayscale'
  observationYear = 2012
  qualifiedOn = '2026-11-15'
  originUrl = 'https://science.nasa.gov/earth/earth-observatory/earth-at-night/maps/'
  sourceUrl = 'https://assets.science.nasa.gov/content/dam/science/esd/eo/images/imagerecords/144000/144896/BlackMarble_2012_01deg_gray_geo.tif'
  source = [ordered]@{ width=3600; height=1800; bytes=(Get-Item -LiteralPath $SourcePath).Length; sha256=$expectedHash; pixelScale=$scale; tiePoint=$tie; inlineGeoKeys=$keys }
  georeference = [ordered]@{ crs='EPSG:4326'; datum='WGS 84'; rasterType='PixelIsArea'; west=-180; east=180; north=90; south=-90; columnDirection='west-to-east'; rowDirection='north-to-south'; degreesPerPixel=0.2; pixelCenterFormula='lon = -180 + (column + 0.5) * 0.2; lat = 90 - (row + 0.5) * 0.2' }
  derivative = [ordered]@{ resourceUrl='/data/globe-night-lights/black-marble-2012.png'; width=1800; height=900; bytes=(Get-Item -LiteralPath $outputPath).Length; sha256=(Get-FileHash -LiteralPath $outputPath -Algorithm SHA256).Hash.ToLowerInvariant(); method='Exact 2x2 encoded grayscale block mean, integer round half up, no crop. PNG RGB8 via Windows GDI+; all three channels identical.' }
  credit = 'NASA Earth Observatory images by Joshua Stevens, using Suomi NPP VIIRS data from Miguel Roman, NASA Goddard Space Flight Center.'
  usageUrl = 'https://www.nasa.gov/nasa-brand-center/images-and-media/'
  limitations = @('Display brightness, not calibrated radiance or a census of cities.', 'Composite observed in 2012, reprocessed for the 2017 Earth at Night release; independent of the 2012/2023 audio frames.', 'Black pixels do not establish measured zero or scientific absence.', 'Downsampling, interpolation and amber color presentation reduce spatial detail; no artificial points are inserted.', 'A static all-night composite, not live illumination or an astronomical day/night terminator.')
}
$json = $manifest | ConvertTo-Json -Depth 8
$indent = 0
$json = (($json -split '\r?\n' | ForEach-Object {
  $line = $_.Trim()
  if ($line -match '^[}\]]') { $indent-- }
  ('  ' * $indent) + $line
  if ($line -match '[{\[]$') { $indent++ }
}) -join "`n")
[IO.File]::WriteAllText((Join-Path $OutputDirectory 'manifest.json'), $json + "`n", [Text.UTF8Encoding]::new($false))
$manifest.derivative | ConvertTo-Json
