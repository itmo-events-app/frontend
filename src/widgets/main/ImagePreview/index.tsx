// import { useEffect, useState } from 'react';
// import axios from 'axios';

type Props = {
  className?: string;
  src: string;
  alt: string;
};

function ImagePreview(props: Props) {

  // const [source, setSource] = useState("");

  // useEffect(() => {
  //   if (props.src != null) {
  //     axios
  //       .get(props.src, { responseType: 'arraybuffer' })
  //       .then(response => {
  //         const base64 = btoa(
  //           new Uint8Array(response.data).reduce(
  //             (data, byte) => data + String.fromCharCode(byte),
  //             ''
  //           )
  //         );
  //         setSource("data:;base64," + base64);
  //       });
  //   }
  // }, [props.src]);

  return <img className={props.className} src={props.src} alt={props.alt} />;
}

export default ImagePreview;
