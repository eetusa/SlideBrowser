import React, { useEffect, useState } from 'react';
import Images from './Images';
import styles from './Home.css';

const getFileName = (path) => {
  let temp = '';
  const str = path;

  // eslint-disable-next-line no-plusplus
  for (let i = str.length - 1; i > 0; i--) {
    if (str[i] === '\\' || str[i] === '/') {
      i = 0;
    } else {
      temp = str[i] + temp;
    }
  }
  if (temp.slice(-3) === 'txt') {
    temp = temp.slice(0,temp.length-4);
  }
  return temp;
}


const ImageDisplay = ({ handleKeyPress, dir, filters, setGalleryView, imageGallery, setImageGallery }) => {
  // eslint-disable-next-line global-require
  const fs = require('fs');
  let images = [];
  const readJson = (path: string) => {
    const rawdata = fs.readFileSync(path, 'utf8');
    rawdata.trim();
    const data = JSON.parse(rawdata);

    return data;
  }
  const filterList = filters.split(' ');
  const checkDataFile = (path: string) => {
    try {
      return readJson(`${path}\\data\\data.json`);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    let templist = [];
    for (let i = 0; i < dir.length; i += 1) {
      const dataFile = checkDataFile(dir[i]);
      if (dataFile !== null) {
        for (let j = 0; j < dataFile.length; j += 1) {
          const filename = getFileName(dataFile[j].file);

          for (let k = 0; k < dataFile[j].pages.length; k +=1) {
            // console.log(dataFile[j].pages[k]);
            if (filterList.length < 2 && filterList[0] === ''){
              templist.push([`file:///${dir[i]}/Images/${filename+k}.png`, dataFile[j].pages[k].title]);
            } else {
              for (let h = 0; h < filterList.length; h += 1){
                if (dataFile[j].pages[k].text.toLowerCase().indexOf(filterList[h].toLowerCase()) > -1){
                  templist.push([`file:///${dir[i]}/Images/${filename+k}.png`, dataFile[j].pages[k].title]);
                }
              }
            }
          }
        }
      }
    }
    setImageGallery(templist);
  },[dir, filters]);



  return (
    <div className={styles.locationGrid}>

      {imageGallery.map ( (item, index) => {
        return (
          <div tabIndex={5+index} onKeyDown={ (e) => {
            console.log(e.key)
            if (e.key==='Enter'){
              setGalleryView([true, item[0], index])
            }
          }} onClick={() => setGalleryView([true, item[0], index]) } key={Math.random() * 10000 * Math.random()} className={styles.picture}>
            <div
              className={styles.pictureTitle}
            >
              {item[1]}
            </div>
            <img src={item[0]} alt = ""></img>
          </div>
        );
       })}
    </div>
  );
};

export default ImageDisplay;
