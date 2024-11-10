import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

function UserBadgeItem({user, handleFunction}) {
  return (
    <Box
    px={2}
    py={1}
    borderRadius="lg"
    m={1}
    mb={2}
    variant="solid" // Not applicable to Box, but shown for reference
    fontSize={12}
    colorScheme="purple" // Not directly applicable to Box; use backgroundColor instead
    backgroundColor="purple.500" // Set the background color
    color="white" // Set the text color
    cursor="pointer"
    _hover={{ bg: 'purple.600' }} // Optional hover effect
    onClick={handleFunction}
    >
            {user.name}
            <CloseIcon pl={1}/>

    </Box>
  )
}

export default UserBadgeItem
