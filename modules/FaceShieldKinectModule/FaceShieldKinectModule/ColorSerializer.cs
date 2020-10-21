using Microsoft.Kinect;
using System.IO;
using System.Windows;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System;

namespace FaceShieldKinectModule
{
    public static class ColorSerializer
    {
        static WriteableBitmap _colorBitmap = null;
        static byte[] _colorPixels = null;
        static int _colorWidth;
        static int _colorHeight;
        static int _colorStride;

        public static string Serialize(this ColorImageFrame frame)
        {
            if (_colorBitmap == null)
            {
                _colorWidth = frame.Width;
                _colorHeight = frame.Height;
                _colorStride = _colorWidth * PixelFormats.Bgra32.BitsPerPixel / 8;
                _colorPixels = new byte[frame.PixelDataLength];
                _colorBitmap = new WriteableBitmap(_colorWidth, _colorHeight, 96.0, 96.0, PixelFormats.Bgra32, null);
            }

            frame.CopyPixelDataTo(_colorPixels);

            _colorBitmap.WritePixels(new Int32Rect(0, 0, _colorWidth, _colorHeight), _colorPixels, _colorStride, 0);
            WriteableBitmap writeable = new WriteableBitmap(_colorWidth, _colorHeight, 96.0, 96.0, PixelFormats.Bgra32, null);
            return getBase64(_colorBitmap);
        }

        static string getBase64(WriteableBitmap bitmap)
        {
            BitmapEncoder encoder = new JpegBitmapEncoder();
            encoder.Frames.Add(BitmapFrame.Create(bitmap as BitmapSource));
            using (var stream = new MemoryStream())
            {
                encoder.Save(stream);
                return "data:image/jpg;base64," + Convert.ToBase64String(stream.ToArray());
            }
        }
    }
}
