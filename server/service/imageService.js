const uuid = require('uuid');
const path = require('path');
const fs = require('fs/promises');

class ImageService {
    createImages(files){
        const images = [];
        for(let file in files) {
            const fileName = uuid.v4() +'.jpg';
            files[file].mv(path.resolve(__dirname, '..', 'static', fileName));
            images.push(fileName);
        }
        return images
    }
    deleteImages(images){
        for(let img of images) {
            const filePath = path.resolve(__dirname, '..', 'static', img);
            fs.unlink(filePath);
        }
    }
}

module.exports = new ImageService();