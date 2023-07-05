import React, { Component, useRef, useState } from 'react';
import { GoogleMap, LoadScript, MarkerF,useLoadScript, Autocomplete } from '@react-google-maps/api';
import SearchBox from '../SearchBox'
import MenuDropdown from '../MenuDropdown'
import {setPickUpCoords ,changePickUpAddress, setDropCoords,changeDropAddress } from '../../redux/reducers/locationSlice'
import FloatingIcon from '../FloatingIcon'
import InputBase from '@mui/material/InputBase';
import styles from '../../styles/users.module.css'
import { useRouter } from 'next/navigation'


import MiniDrawer from '../Drawer';
import { useSelector, useDispatch } from 'react-redux';
import {Chip,Stack,Fab} from '@mui/material';
import NavigationIcon from '@mui/icons-material/Navigation';

const containerStyle = {
  width: '100vw',
  height: '100vh'
};


const Map = (props)=> {
  const router = useRouter()
  const ref = useRef(null)
  const ref2 = useRef(null)
  const [formStep, setFormStep] = useState(1)
  const dispatch =useDispatch()
  const {pickupCoord, pickupAddress, dropAddress, dropCoord} = useSelector(state=>state.location)
  const {userVehicleType} = useSelector(state=>state.user)

  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDLfjmFgDEt9_G2LXVyP61MZtVHE2M3H-0",
    libraries: ['places']
     // ,
    // ...otherOptions
  })
  const handlePlacePickUpChange = async() => {
    dispatch(changePickUpAddress(ref.current.value))
    const res = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${ref.current.value}&apiKey=4ecc4127475849f1aaf505f70ffa51a4`)
    const data =await res.json()
    const cords = {
      lat: data.features[0].properties.lat,
      lng: data.features[0].properties.lon
    }
    dispatch(setPickUpCoords(cords))
    
  }
  const handlePlaceDropChange = async() => {
    try{
      dispatch(changeDropAddress(ref2.current.value))
      const res = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${ref2.current.value}&apiKey=4ecc4127475849f1aaf505f70ffa51a4`)
      const data =await res.json()
      const cords = {
        lat: data.features[0].properties.lat,
        lng: data.features[0].properties.lon
      }
      dispatch(setDropCoords(cords))
    }catch(err){
      console.log(err)
    }
  
    
  }
  const handlePickUpChange =async(e)=> {
    const locationCoords = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()

    }
    const res = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${locationCoords.lat}&lon=${locationCoords.lng}&apiKey=a1dd45a7dfc54f55a44b69d125722fcb`)
    const data =await res.json()
    dispatch(changePickUpAddress(data.features[0].properties.formatted))
   dispatch(setPickUpCoords(locationCoords))
  }

  const handleDropChange =async(e)=> {
    const locationCoords = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()

    }
    const res = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${locationCoords.lat}&lon=${locationCoords.lng}&apiKey=a1dd45a7dfc54f55a44b69d125722fcb`)
    const data =await res.json()
    dispatch(changeDropAddress(data.features[0].properties.formatted))
   dispatch(setDropCoords(locationCoords))
  }
  const handleClick =()=>{
    //dispatches but the cursor and map does not update
    dispatch(changePickUpAddress("balaju, eklatar, kathmandu"))
  }
  const handleClick2 =()=>{
    dispatch(changeDropAddress("Tinkune, Kathmandu, Nepal"))
  }

  if(isLoaded){
    return (
      
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={pickupCoord}
        zoom={14}
        // onLoad={onLoad}
      >
       
          {(formStep == 1 || !props.showAllButtons ) &&  (
          <MarkerF
          draggable={props.showAllButtons}
          onDragEnd={handlePickUpChange}
            // onLoad={onLoad}
            position={pickupCoord}
          />
          )}
         { (formStep ==2 || !props.showAllButtons)  && (
            <MarkerF
            draggable={props.showAllButtons}
            onDragEnd={handleDropChange}
             // onLoad={onLoad}
             position={dropCoord}
           />
         )}
         
          
          {props.showAllButtons && (
            <div>
              <div className={styles.searchBox}> 
              <div className={styles.chipList}>
              
             
              
                  <Stack direction="row" spacing={1}>
                  <Chip label="balaju, eklatar, kathmandu" style={{backgroundColor:'#fff'}} variant="outlined" onClick={handleClick} />
                  <Chip label="Tinkune, Kathmandu, Nepal" style={{backgroundColor:'#fff'}} variant="outlined" onClick={handleClick2}/>
                  </Stack>
                  {formStep == 1 ? (
                  <Fab variant="extended" onClick={()=>setFormStep(2)} >
                    <NavigationIcon  sx={{ mr: 1 }} />
                    Pickup
                  </Fab>

            
                  ) : (
                    <div>
                    
                      <Fab variant="extended"  onClick={()=>router.push('/users/map-details')}  >
                    <NavigationIcon  sx={{ mr: 1 }} />
                    Confirm Destination
                  </Fab>
                  <Fab variant="extended" onClick={()=>setFormStep(1)} >
                    <NavigationIcon  sx={{ mr: 1 }} />
                    Back
                  </Fab>
                      </div>
                  
                  )}
                  
              </div>

            <div className={styles.basicMenu}>
              
          <MenuDropdown/>
          <FloatingIcon/>

          </div>

              </div>
              <div  style={{
                      boxSizing: `border-box`,
                      border: `1px solid transparent`,
                      padding: `0 12px`,
                      borderRadius: `3px`,
                      fontSize: `14px`,
                      outline: `none`,
                      textOverflow: `ellipses`,
                      position: "absolute",
                      left: "40%",
                      marginTop:'-30px'
                    }}>

                      {formStep == 1 ? (
                        <Autocomplete onPlaceChanged={()=> handlePlacePickUpChange()} >
                        <input
                        ref={ref}
                        style={{width:'200px'}}
                        onChange={(e)=>  dispatch(changePickUpAddress(e.target.value))}
                        placeholder="ENTER PICKUP ADDRESS" value={pickupAddress} />
                        </Autocomplete>

                      ): (
                        <Autocomplete onPlaceChanged={()=> handlePlaceDropChange()} >
                        <input
                        ref={ref2}
                        style={{width:'200px'}}
                        onChange={(e)=>  dispatch(changeDropAddress(e.target.value))}
                        placeholder="ENTER PICKUP ADDRESS" value={dropAddress} />
                        </Autocomplete>
                      )} 


          
              </div>
          </div>
          )}
            
    
      
     
      </GoogleMap>

  )
  }else{
    return "loading..."
  }
 
}

export default Map