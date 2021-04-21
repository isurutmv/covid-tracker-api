const { required } = require("joi");

(() => {
  "use strict";

  //import image resize library sharp
  const sharp = require("sharp");

  /**
   * Image resize method
   * @param {Number} width - Resize image width
   * @param {Number} height - Resize image height
   * @param {Buffer} imageBuffer - request image buffer
   * @return {File} resizedImage Resized image file
   */
  exports.resizeImage = async (width, height, imageBuffer) => {

    const imageFile = await sharp(imageBuffer)
      .resize(width, height)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toBuffer();

    return imageFile;
  };

})();
