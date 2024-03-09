import fs from 'fs';

export const writeFile = (filePath, data) => {
    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(filePath);
        writeStream.write(data);
        writeStream.on('finish', () => resolve(data))
        writeStream.on('error', err => reject(err))
        writeStream.end()
    }); 
}

export const readFile = filePath => {
    return new Promise((resolve, reject) => {
        if(fs.existsSync(filePath))
        {
            const readStream = fs.createReadStream(filePath);
            let data = '';

            readStream.on('data', chunk => data += chunk)
            readStream.on('end', () => resolve(data))
            readStream.on('error', err => reject(err))
        }
        else resolve(null);
    });  
}