import React from 'react'
import '../styles/Footer.css'
import Typography from '@mui/material/Typography'
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Link from '@mui/material/Link';

const Footer = () => {
    return (
        <div className="footer">
            <Typography
                sx={{ padding: "0px", margin: "0px", border: "0px" }}
            >
                <LinkedInIcon />
                <Link href="https://www.linkedin.com/in/christopher-brugal" target="_blank" rel="noopener" underline="hover" color="white">
                    Christopher Brugal
                </Link>
                {', '}
                <Link href="https://www.linkedin.com/in/cole-kitroser-35646b170/" target="_blank" rel="noopener" underline="hover" color="white">
                    Cole Kitroser
                </Link>
                {', '}
                <Link href="https://www.linkedin.com/in/alexis-dougherty/" target="_blank" rel="noopener" underline="hover" color="white">
                    Alexis Dougherty
                </Link>
                {', '}
                <Link href="https://www.linkedin.com/in/WillBAnders/" target="_blank" rel="noopener" underline="hover" color="white">
                    Blake Anderson
                </Link>
            </Typography>
            <Typography>
                <br />Copyright © 2022 TutorsVILLE.
            </Typography>
        </div>
    )
}

export default Footer
