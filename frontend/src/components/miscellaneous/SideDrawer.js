import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import {BellIcon, ChevronDownIcon} from '@chakra-ui/icons';
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import ChatLoading from '../ChatLoading';
import axios from 'axios';
import UserListItem from '../User Avatar/UserListItem';
import {getSender} from '../../config/ChatLogics';
import NotificationBadge, { Effect } from 'react-notification-badge';

function SideDrawer() {

  const [search, setSearch] =  useState("");
  const [searchResult, setSearchResult]= useState([]);
  const [loading, setLoading]=useState(false);
  const [loadingChat, setLoadingChat]=useState(false);

  const { setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats} = ChatState();
  const history= useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const logoutHandler= ()=>{
    localStorage.removeItem("userInfo");
    history("/");
  };
  const toast= useToast();
  const handleSearch= async()=>{
    if(!search){
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable:true,
        position: 'top-left',
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed To Load Search Result",
        status: "error",
        duration: 5000,
        isClosable:true,
        position: 'top-left',
      });
    
    }
  };
  const accessChat = async(userId)=>{

    try {
       setLoadingChat(true)
       const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
        const {data}= await axios.post("/api/chat", {userId},config);

        if(!chats.find((c)=> c._id===data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false)
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable:true,
        position: 'top-left',
      });
    }
  }

  return (
    <>
     <Box 
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      width="100%"
      padding="5px 10px"
      borderWidth="5px"
     >
      <Tooltip label="Search User To Chat" hasArrow placement="bottom-end">
    <Button variant="ghost" onClick={onOpen} >
      <i className='fa fa-search'></i>
      <Text d={{base: "none", md: "flex"}} p="4">
        Search User
      </Text>
      </Button>
      </Tooltip>
      <Text fontSize="2xl" fontFamily="work sans" align="center" >Talk-A-Tive</Text>
      <div>
        <Menu>
          <MenuButton p={1}>
          <NotificationBadge
          count={notification.length}
          effect={Effect.SCALE}
          />
            <BellIcon fontSize="2xl" m={1}/>
          </MenuButton>
          <MenuList paddingLeft={2}>
            {!notification.length && "No New Messages"}
            {notification.map(notif=>(
              <MenuItem key={notif._id} onClick={()=>{
                setSelectedChat(notif.chat)
                setNotification(notification.filter((n)=> n !== notif));
              }}>
              {notif.chat.isGroupChat?`New Message in ${notif.chat.ChatName}`
              :`New Message from ${getSender(user,notif.chat.users)}`}
              </MenuItem>
            ))}
            </MenuList>
        </Menu>
        <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}/>
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>

             <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuDivider/>
            <MenuItem onClick={logoutHandler}>Log out</MenuItem>
          </MenuList>
        </Menu>
      </div>
      </Box> 
      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay/>
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>

          <DrawerBody>
          <Box display="flex" paddingBottom={2}>
              <Input placeholder='Search by Name or Email' marginRight={2} value={search}
              onChange={(e)=>setSearch(e.target.value)}/>
              <Button
               onClick={handleSearch}
               >Go</Button>
          </Box>
          {loading? <ChatLoading/>:
          (
            searchResult?.map((user) =>(
              <UserListItem
              key={user._id}
              user={user}
              handleFunction={()=>accessChat(user._id)}
              />
            ))
          )}

          {loadingChat && <Spinner ml="auto" display="flex"/>}
        </DrawerBody>
        </DrawerContent>
       
      </Drawer>
    </>
  )
}

export default SideDrawer
