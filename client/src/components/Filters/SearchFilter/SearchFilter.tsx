import { useEffect, useState } from 'react';
import './SearchFilter.css'
import TextField, { TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles';
import { useDebounce } from '../../../hooks/debounce';
import { useAppDispatch } from '../../../hooks/redux';
import { deviceSlice } from '../../../store/reducers/DeviceSlice';
import { useAppSelector } from '../../../hooks/redux';

const StyledTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
    width: '90%',
    fontSize: '14px',
    '& label.Mui-focused': {
        color: theme.palette.mode === 'dark' ? theme.palette.customColor.dark : theme.palette.customColor.light
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'white',
        },
        '&:hover fieldset': {
            borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.mode === 'dark' ? theme.palette.customColor.dark : theme.palette.customColor.light,
        },
    },
}));

const SearchFilter = () => {
    const { search } = useAppSelector(state => state.DeviceReducer)
    const [text, setText] = useState<string>('');
    const dispatch = useAppDispatch();
    const debounceCallback = useDebounce((str: string) => {
        dispatch(deviceSlice.actions.setSearch(str));
        dispatch(deviceSlice.actions.categorySelected());
    }, 400)
    function changeInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setText(e.currentTarget.value);
        debounceCallback(e.currentTarget.value);
    }
    useEffect(() => {
        setText(search || '')
    }, [search])
    return (
        <div className='SearchFilter'>
            <StyledTextField
                InputProps={{
                    endAdornment: (
                        <InputAdornment position='end'>
                            <IconButton onClick={() => {
                                setText('');
                                debounceCallback('');
                            }}>
                                <ClearIcon sx={{ display: text ? 'block' : 'none' }} />
                            </IconButton>
                        </InputAdornment>
                    )
                }}
                size="small"
                value={text}
                onChange={e => changeInput(e)}
                type='text'
                label="Поиск товара..."
                variant="outlined"
            />
        </div>
    );
};

export default SearchFilter;