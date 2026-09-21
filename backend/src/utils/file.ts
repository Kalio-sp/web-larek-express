import fs from 'fs';
import path from 'path';

const moveFile = (fileName: string) => {
  const oldPath = path.join(__dirname, '../public/temp', fileName);

  const newPath = path.join(__dirname, '../public/images', fileName);

  fs.renameSync(oldPath, newPath);

  return `/images/${fileName}`;
};

export default moveFile;
