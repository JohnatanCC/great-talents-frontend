import Logo from "../../../assets/system_logo.png"
import LogoIcon from "../../../assets/system-favicon.png"
import { Image } from '@chakra-ui/react'

export const LogoImage = ({ isIcon }: { isIcon?: boolean }) => {
    return (
        <Image
            src={isIcon ? LogoIcon : Logo}
            alt="Great Talents Logo"
            maxW={isIcon ? { base: '40px', md: '50px', lg: '38px' } : { base: '120px', md: '150px', lg: '100px' }}
            h="auto"
            objectFit="contain"
        />
    )
}