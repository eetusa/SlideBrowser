import React, { useState } from 'react';
import styles from './Home.css';

const Images = ({ textdata, path, filters }) => {
  const [imageArray, setImageArray] = useState([]);
  const [showGallery, setShowGallery] = useState([false, 0]);

  console.log("  ");
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

  const OpenGallery = (index) => {
    return (
      <div className={styles.gallery}> {showGallery[1]} </div>
    )
  };

  const addToImageArray = (page) => {
    let temp = [...imageArray];
    temp.push(page);
    setImageArray(temp);
  }

  return (
    <div style={{position: "relative"}}>
        {showGallery[0] && <OpenGallery />}
        {textdata.map ( (file) => {
          const filename = getFileName(file.file);

          return(
            <div key={Math.random() * 10000 * Math.random()} className={styles.locationGrid}>
            {file.pages.map ( (page, index) => {

              if (filters.length === 0) {
                return (
                  <div key={Math.random() * 10000 * Math.random()} className={styles.picture}>
                    <img onClick={() => setShowGallery([true, index])} src={`file:///${path}/Images/${filename+index}.png`} alt = ""></img>
                  </div>
                )
              } else {
                for (let i = 0; i < filters.length; i += 1) {
                  if (page.text.toLowerCase().indexOf(filters[i].toLowerCase()) > -1){
                    return (
                      <div key={Math.random() * 10000 * Math.random()} className={styles.picture}>
                        <img onClick={() => setShowGallery([true, index])} src={`file:///${path}/Images/${filename+index}.png`} alt = ""></img>
                      </div>
                    )
                  }
                }
              }

            })}
            </div>
          )

        })}


    </div>
  );
}

export default Images;


// <img
//   style={{ width: '500px' }}
//   src={`file:///${dir[0]}/image.jpg`}
//   alt=""
//   key="1244jj
// />
