class PrinterUtility {
   size;
   width = 20;
   height = 20;

   constructor() {
       const paramURL = new URL(window.location.href);
       this.size = paramURL.searchParams.get('size') || '20x20';
       [this.height, this.width] = this.size.split('x').map(val => parseInt(val))
   }

   getSize = () => {
       return {width: this.width, height: this.height}
   }

   resizeImage = (image, maxSize) => {
       let canvas = document.createElement('canvas'),
           width = image.width,
           height = image.height;
       if (width > height) {
           if (width > maxSize) {
               height *= maxSize / width;
               width = maxSize;
           }
       } else {
           if (height > maxSize) {
               width *= maxSize / height;
               height = maxSize;
           }
       }
       canvas.width = width;
       canvas.height = height;
       canvas.getContext('2d').drawImage(image, 0, 0, width, height);
       return canvas.toDataURL('image/jpg', 1);
   }
}

const PrinterUtil = new PrinterUtility();

export default PrinterUtil;

