import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios';
import  { useNavigate }  from "react-router-dom";


function Signup() {
  
  const [show,setShow]=useState(false)
  const [name,setName]=useState()
  const [email,setEmail]=useState()
  const [password,setPassword]=useState()
  const [conformpassword,setConformpassword]=useState()
  const [pic,setPic]=useState()
  const [loading,setLoading]=useState(false)
  
  
  const toast=useToast();
  const history = useNavigate();

const handleClick=()=> setShow(!show);

const postDetails= (pics)=>{
  setLoading(true);
  if(pics === undefined){
    toast({
      title:"please select the image",
      status:"warning",
      duration: 5000,
      isClosable:true,
      position: "bottom"
    });
    return;
  }
  if(pics.type === "image/jpeg" || pics.type === "image/png"){
    const data= new FormData();
    data.append("file", pics);
    data.append("upload_preset", "chat-app");
    data.append("cloud_name","alipunhal");
    fetch("https://api.cloudinary.com/v1_1/alipunhal/image/upload",{method:"post",body:data,})
    .then((res)=>res.json())
    .then((data)=>{
      console.log(data)
      setPic(data.url.toString());
      setLoading(false);
        
    })
  }else{
    toast({
      title:"please select the image",
      status:"warning",
      duration: 5000,
      isClosable:true,
      position: "bottom"
    });
    setLoading(false);
    return;
  }
};
const submitHandler = async()=>{
  setLoading(true);
  if(!name || !email || !password || !conformpassword){

    toast({
      title:"please fill all the fileds",
      status:"warning",
      duration: 5000,
      isClosable:true,
      position: "bottom"
    });
    setLoading(false);
    return;
  }

  if(password  !== conformpassword){
    toast({
      title:"password Do Not Match",
      status:"warning",
      duration: 5000,
      isClosable:true,
      position: "bottom"
    });
    setLoading(false);
    return;
  }
    console.log(name,email,password,pic);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      console.log(data); 
       toast({
      title:"Registration Successful",
      status:"success",
      duration: 5000,
      isClosable:true,
      position: "bottom"
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
    setLoading(false);
    history("/");

  } catch (error) {

    toast({
      title:"Error Occured",
      description: error.response.data.message,
      status:"error",
      duration: 5000,
      isClosable:true,
      position: "bottom"
    });
    setLoading(false)
  }
}

  return (
    <VStack spacing="5px">
      <FormControl id='first-name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input placeholder='Enter Your Name' onChange={(e)=>setName(e.target.value)}/>
      </FormControl>

      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input placeholder='Enter Your Email' onChange={(e)=>setEmail(e.target.value)}/>
      </FormControl>

      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
        <Input type={show ? "text" : "password"} placeholder='Enter Your Password' onChange={(e)=>setPassword(e.target.value)}/>
        <InputRightElement width="4.5rem">
        <Button h="1.7rem" size="sm" onClick={handleClick}>
            {show ? "hide" : "show"}
            </Button>
        </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id='password' isRequired>
        <FormLabel>ConformPassword</FormLabel>
        <InputGroup>
        <Input type={show ? "text" : "password"} placeholder='Enter Your Password' onChange={(e)=>setConformpassword(e.target.value)}/>
        <InputRightElement width="4.5rem">
        <Button h="1.7rem" size="sm" onClick={handleClick}>
            {show ? "hide" : "show"}
            </Button>
        </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id='pic' isRequired>
        <FormLabel>Upload Your Picture</FormLabel>
        <Input type='file' p={1.5} accept="image/*" onChange={(e)=>postDetails(e.target.files[0])}/>
      </FormControl>

      <Button
      colorScheme="blue"
      width="100%"
      style={{marginTop: 15}}
      onClick={submitHandler}
      isLoading={loading}
      >
        Signup
      </Button>
    </VStack>
  )
}

export default Signup
