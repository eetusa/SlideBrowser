import { BrowserWindow } from 'electron';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import styles from './Home.css';
import ImageDisplay from './ImageDisplay';




export default function Home(): JSX.Element {
   const appPath = require("path").dirname(require('electron').remote.app.getPath("exe"));
  // const path = app.getAppPath('exe');
  // const path = `file:///${__dirname}/testi/image.jpg`;
  const [dir, setDir] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [readyStatus, setReadyStatus] = useState(true);
  // eslint-disable-next-line global-require
  const { dialog } = require('electron').remote;
  // eslint-disable-next-line global-require
  const fs = require('fs');

  const readJson = (path: string) => {
    const rawdata = fs.readFileSync(path, 'utf8');
    rawdata.trim();
    const data = JSON.parse(rawdata);
    // eslint-disable-next-line no-console
    return data;
  };


  const checkDataFile = (path: string) => {
    try {
      return readJson(`${path}\\data\\data.json`);
    } catch {
      return null;
    }
  };

  // eslint-disable-next-line func-names
  const doneCallBack = function (code: Array, path: string) {
    console.log(code)
    if (code[0] === 11) {
      console.log("sup")
      // eslint-disable-next-line no-console
    }
      setReadyStatus(true);
  };

  const callJava = (path: string) => {
    // eslint-disable-next-line global-require
    console.log(path)
    const nrc = require('node-run-cmd');
    nrc.run(
      `java -jar ${appPath}\\resources\\resources\\support\\deconstructor1.0.jar ${path} ${appPath}\\resources\\resources\\support\\`).then(function(exitCodes){
        doneCallBack(exitCodes, path);
      }, function (err){
        console.log('Command failed to run: ', err);
      });
  };

  const testi = () => {
    const newDir = dialog.showOpenDialogSync({ title:'Valitse kansio', properties: ['openDirectory'] });
    if (newDir !== undefined && dir.indexOf(newDir[0]) === -1) {
      setReadyStatus(false);
      if (checkDataFile(newDir[0]) === null){

        callJava(newDir[0]);
      } else {
        setReadyStatus(true);
      }
      const temp = [...dir];
      temp.push(newDir[0]);
      setDir(temp);
    }
    textXnput.current.focus();
  };

  const handleClick = (index: number) => {
    const temp = [...dir];
    temp.splice(index, 1);
    setDir(temp);
  };

  const getLastFolderFromPath = (strr: any[]) => {
    let temp = '';
    const str = strr;

    // eslint-disable-next-line no-plusplus
    for (let i = str.length - 1; i > 0; i--) {
      if (str[i] === '\\') {
        i = 0;
      } else {
        temp = str[i] + temp;
      }
    }
    return temp;
  };
  const refRef = useRef(null);
  useEffect( () => {
    ;
  }, [galleryView])

  const browseGallery = (direction) => {
    if (direction === 0){
      let temp = galleryView[2]-1;
      if (temp === -1){
        temp = imageGallery.length-1;
      }
      setGalleryView([galleryView[0], imageGallery[temp][0],temp]);
    } else {
        let temp = galleryView[2]+1;
        if (temp === imageGallery.length){
          temp = 0;
        }
        setGalleryView([galleryView[0], imageGallery[temp][0],temp]);
    }
  }



  const handleKeyPress = (e) => {
    if (e===undefined || e===null)return;
    if (e.key === 'ArrowLeft' ){
      browseGallery(0);
    }
    if (e.key === 'ArrowRight') {
      browseGallery(1);
    }
    if (e.key === 'Escape'){
      if (galleryView[0]===true){
        setGalleryView([false, galleryView[1],galleryView[2]]);
      } else {
        setTextInput("");
      }
    }
  };

  const [imageGallery, setImageGallery] = useState([]);
  const [pointer, setPointer] = useState(true);
  const [galleryView, setGalleryView] = useState([false, '', 0]);
  const textXnput = useRef(null);
  return (
    <div ref={refRef} tabIndex="-1"
    onKeyDown={(e) => handleKeyPress(e)}
     className={styles.container} data-tid="container">
      {galleryView[0] && <div
      onMouseOver={() => refRef.current.focus()}
      onClick={() => {
          if(pointer){
            setGalleryView([false, galleryView[1], 0]);
          }
        }}
        className={styles.gallerycontainer}>
          <img
            className={styles.arrow}
            src='file:///./resources/resources/leftarrow.png'
            onMouseOver={() => {setPointer(false)
              refRef.current.focus()}}
onMouseLeave={() => {setPointer(true)
                refRef.current.focus()}}
            onClick={() => browseGallery(0)}
            role="button"
          >

          </img>
        <img
          className={styles.galleryImage}
          src={galleryView[1]}
          alt=""
          onMouseOver={() => {setPointer(false)
            refRef.current.focus()}}
onMouseLeave={() => {setPointer(true)
              refRef.current.focus()}}
        >
        </img>
        <img
            className={styles.arrow}
            src='file:///./resources/resources/rightarrow2.png'
            onMouseOver={() => {setPointer(false)
                              refRef.current.focus()}}
            onMouseLeave={() => {setPointer(true)
                                refRef.current.focus()}}
            onClick={() => browseGallery(1)}
            role="button"
          ></img>
        </div>
      }
      <div className={styles.head}>

        <div className={styles.top}>
          <h2>Slide Browser</h2>
        </div>
        <div className={styles.bottom}>
          <button type="button" onClick={() => testi()}>Avaa kansio</button>
          <div className={styles.folders}>
            <div className={styles.foldersInfo}>Avatut kansiot: </div>
            {dir.map( (item, index) => {
              return (
                <div className={styles.foldersFolder} key={Math.random()*(10000)*Math.random()}>
                  <div>
                    <div>{getLastFolderFromPath(item)}</div>
                  </div>
                  <div onClick={() => handleClick(index)} className={styles.foldersFolderButton}>
                    X
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.search}>
          <div>Hakusanat: </div>
          <input ref={textXnput} autoFocus type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)}></input>
          <button onClick={() => setTextInput("")} >x</button>
        </div>
        <div className={readyStatus? styles.hideLoading : styles.showLoading}>Määritetään dataa kansiosta... Tämä saattaa kestää hetken, riippuen tiedostojen määrästä ja koosta. Odota hetki.</div>
      </div>
      <div className={styles.gridcontainer}>
        { (readyStatus && dir.length !== 0) && <ImageDisplay imageGallery={imageGallery} setImageGallery={setImageGallery} handleKeyPress={handleKeyPress} galleryView={galleryView} setGalleryView={setGalleryView} dir={dir} filters={textInput} />}
        { !readyStatus && <h2>Loading..</h2>}
      </div>
    </div>
  );
}
