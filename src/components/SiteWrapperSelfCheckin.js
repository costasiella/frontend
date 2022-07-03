import React, { ReactNode, ReactText } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router-dom"
import { useQuery } from "@apollo/client"
import { ToastContainer, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'react-confirm-alert/src/react-confirm-alert.css'

import CSStandalonePageLoader from "./ui/CSStandalonePageLoader"
import GET_USER from "../queries/system/get_user"

import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const now = new Date()

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={'#'}>
    {children}
  </Link>
);

function SiteWrapperSelfCheckin({t, match, history, children}) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { error, loading, data } = useQuery(GET_USER)
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.900')

  if (loading) return <CSStandalonePageLoader />
  if (error) return <p>{t('system.user.error_loading')}</p>; 

  console.log(data)

  return (
    <ChakraProvider>
      <>
        <Box bg={bg} px={4}>
          <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
            <Box>Logo</Box>

            <Flex alignItems={'center'} borderColor={borderColor}>
              <Stack direction={'row'} spacing={7}>
                <Button onClick={toggleColorMode}>
                  {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                </Button>

                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}>
                    <Avatar
                      size={'sm'}
                      src={'https://avatars.dicebear.com/api/male/username.svg'}
                    />
                  </MenuButton>
                  <MenuList alignItems={'center'}>
                    <br />
                    <Center>
                      <Avatar
                        size={'2xl'}
                        src={'https://avatars.dicebear.com/api/male/username.svg'}
                      />
                    </Center>
                    <br />
                    <Center>
                      <p>Username</p>
                    </Center>
                    <br />
                    <MenuDivider />
                    <MenuItem>Your Servers</MenuItem>
                    <MenuItem>Account Settings</MenuItem>
                    <MenuItem>Logout</MenuItem>
                  </MenuList>
                </Menu>
              </Stack>
            </Flex>
          </Flex>
          {children}
        </Box>
      </>
    </ChakraProvider>
  )
}


export default withTranslation()(SiteWrapperSelfCheckin)
