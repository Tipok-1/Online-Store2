import { memo } from 'react';
import { IDeviceInfo } from '../../models/IDevice';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface IСharacteristic {
    info: IDeviceInfo,
    dottedSeparator?: boolean,
    fontSize?: number
}
const Сharacteristic = memo(({ info, fontSize, dottedSeparator }: IСharacteristic) => {
    return (
        <>
            {!dottedSeparator ?
                <Typography sx={theme => ({
                    mb: '7px',
                    fontSize: fontSize ? `${fontSize}px` : '',
                    [theme.breakpoints.down("sm")]: {
                        fontSize: '16px',
                    },
                })}>
                    <><span style={{ color: 'rgb(168, 167, 167)' }}>{info.title}  — </span> {info.description}</>
                </Typography>
                :
                <Box sx={theme=>({
                    display: 'flex',
                    alignItems: 'center',
                    mb: '10px',
                    maxWidth: '100%',
                    [theme.breakpoints.down("sm")]: {
                        flexDirection:'column',
                        alignItems:'flex-start'
                    },
                })}>
                    <Typography sx={theme => ({
                        fontSize: fontSize ? `${fontSize}px` : '',
                        wordWrap: 'break-word',
                        [theme.breakpoints.down("sm")]: {
                            fontSize: '16px',
                        },
                    })}>
                        <span style={{ color: 'rgb(168, 167, 167)' }}>{info.title}</span>
                    </Typography>
                    <Box sx={{
                        flex: '1 1 auto',
                        display: 'flex',
                        alignItems: 'center',
                        borderBottom: '1px dotted rgb(168, 167, 167)',
                        height: '1px',
                        margin: '0 15px 0 15px',
                    }}>
                    </Box>
                    <Box sx={theme => ({
                        ml: 'auto',
                        fontSize: fontSize ? `${fontSize}px` : '',
                        wordWrap: 'break-word',
                        [theme.breakpoints.down("sm")]: {
                            fontSize: '16px',
                            ml: '0',
                        },
                    })}>
                        {info.description}
                    </Box>
                </Box>
            }
        </>
    )
})

export default Сharacteristic;