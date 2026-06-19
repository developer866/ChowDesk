
import('sharp').then(({ default: sharp }) => {
  const size = 512;
  sharp({
    create: {
      width: size, height: size, channels: 4,
      background: { r: 232, g: 153, b: 81, alpha: 1 }
    }
  })
  .png()
  .toFile('./public/icon-source.png')
  .then(() => console.log('✅ Placeholder icon created'))
  .catch(console.error);
});
