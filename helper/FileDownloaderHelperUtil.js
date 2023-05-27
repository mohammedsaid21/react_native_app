import axios from 'axios';
import Moment from 'moment';
import { Linking, Platform } from 'react-native';
// import { encode, decode } from 'js-base64';
import { decode } from 'base-64'; // import the decode function from the base-64 library

import { PDFDocument } from 'pdf-lib';
// import Pdf from 'react-native-pdf';

import { decode as atob } from 'base-64';
// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
// import { FileSystem, Sharing } from 'expo';
import * as FileSystem from 'expo-file-system';
// import { FileSystem } from 'react-native-unimodules';
import * as Sharing from 'expo-sharing';

// https://stackoverflow.com/questions/64010990/how-convert-base64-to-pdf-react-native
// https://www.npmjs.com/package/react-native-pdf
// const my_uri = `data:application/pdf;base64,${pdfSource43}`;

class FileDownloaderHelperUtil {

  // base64String
  downloadDocument = async (base64String, fileName) => {
    // let binaryString = decode(base64String);
    // try {
      const binaryString = atob(base64String); // Decode the base64 string to binary data
      const binaryLen = binaryString.length;
      const bytes = new Uint8Array(binaryLen);
    
      for (let i = 0; i < binaryLen; i++) {
        const ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
      }
    
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const fileUri = FileSystem.cacheDirectory + fileName + '.pdf';
    
      try {
        const fileInfo = await FileSystem.writeAsStringAsync(fileUri, blob, {
          encoding: FileSystem.EncodingType.Base64,
        });
    
        await Sharing.shareAsync(fileInfo.uri, { mimeType: 'application/pdf' });
    
        await FileSystem.deleteAsync(fileUri, { idempotent: true });
      } catch (error) {
        console.error(error);
      }
      
      // const pdfUri = FileSystem.documentDirectory + 'document.pdf';

      // Convert base64 string to binary data
      // const binaryData = atob(base64String);

      // // Write the binary data to a file
      // await FileSystem.writeAsStringAsync(pdfUri, binaryData, {
      //   encoding: FileSystem.EncodingType.Base64,
      // });

      // // Share the local file URI
      // await Sharing.shareAsync(pdfUri);

      // const binaryString = atob(pdfSource43);
      // const my_uri = "data:application/pdf;base64" + pdfSource43


      // Create a file in the cache directory with the binary data
      // const pdfUri = `${FileSystem.cacheDirectory}file.pdf`;
      // await FileSystem.writeAsStringAsync(pdfUri, binaryData, {
      //   encoding: FileSystem.EncodingType.Base64,
      // });

      // Share the file
      // await Sharing.shareAsync(pdfUri, { mimeType: 'application/pdf' });


      // let fPath = Platform.select({
      //   ios: fs.dirs.DocumentDir,
      //   android: fs.dirs.DownloadDir,
      // });
      // fPath = `${fPath}/pdfFileName.pdf`;
      // if (Platform.OS === PlatformTypes.IOS) {
      //   await fs.createFile(fPath, base64Data, "base64");
      // } else {
      //   await fs.writeFile(fPath, base64Data, "base64");
      // }

    // } catch (error) {
    //   console.error('Error while downloading file ', error);
    // }


    // const { fs } = RNFetchBlob;
    // const binaryString =
    //   await fs.readFile(RNFetchBlob.wrap(`data:application/pdf;base64,${base64String}`), 'base64');

    // console.log("🚀 ~ file: FileDownloaderHelperUtil.js:25 ~ FileDownloaderHelperUtil ~ downloadDocument= ~ binaryString:", binaryString)
    // const path = `${fs.dirs.DocumentDir}/${fileName}.pdf`;
    // await fs.writeFile(path, binaryString, 'base64');

    // let binaryLen = binaryString.length;

    // let bytes = new Uint8Array(binaryLen);

    // for (let i = 0; i < binaryLen; i++) {
    //   let ascii = binaryString[i];
    //   bytes[i] = ascii;
    // }

    // let blob = new Blob([bytes], { type: 'application/pdf' });
    // let url = URL.createObjectURL(blob);

    // Linking.openURL(url);
    // console.log(url)
  };
}



export default new FileDownloaderHelperUtil();
