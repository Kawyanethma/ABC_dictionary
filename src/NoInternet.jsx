import React, {useState, useEffect} from 'react';
import { defaultOptionsNoInternet } from './assets/lotties/options';
import Lottie from 'react-lottie';

const NoInternet = (props) => {
    // state variable holds the state of the internet connection
    const [status, setStatus] = useState(() => {
        if (navigator.onLine) {
          console.log("Connected to network.");
          return true;
        } else {
          return false;
        }
      });
      useEffect(() => {
        window.ononline = (e) => {
          console.log("Connected to network.");
          setStatus(true);
        };
        window.onoffline = (e) => {
          console.log("Network connection lost.");
          setStatus(false);
        };
      }, [status]);
    // if user is online, return the child component else return a custom component
    return(
        <>
        {status? props.children : <div className='NoInternet'>
        <div className='info'>
            <Lottie
            options={defaultOptionsNoInternet}
            height={200}
            width={200}
            isClickToPauseDisabled={true}
            />
            <h1>No Connection</h1>
            <p>Check your connection and try again !</p>
        </div>
    </div>}
    </>);

}

export default NoInternet;