'use client';

import { Fragment, useState } from 'react';

// MATERIAL - UI
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// PROJECT IMPORTS
import MainCard from 'components/MainCard';
import data from 'data/movies';

// ==============================|| AUTOCOMPLETE - FIXED TAGES ||============================== //

export default function FixedTagsAutocomplete() {
  const fixedOptions = [data[6]];
  const [value, setValue] = useState([...fixedOptions, data[13]]);

  const fixedAutocompleteCodeString = `<Autocomplete
  multiple
  fullWidth
  id="fixed-tags-demo"
  value={value}
  onChange={(event, newValue) => {
    setValue([...fixedOptions, ...newValue.filter((option) => fixedOptions.indexOf(option) === -1)]);
  }}
  options={data}
  getOptionLabel={(option) => option.label}
  renderTags={(tagValue, getTagProps) =>
    tagValue.map((option, index) => (
      <Chip label={option.label} {...getTagProps({ index })} disabled={fixedOptions.indexOf(option) !== -1} />
    ))
  }
  renderInput={(params) => <TextField {...params} placeholder="Fixed Tag" />}
  sx={{
    '& .MuiOutlinedInput-root': {
      p: 1
    },
    '& .MuiAutocomplete-tag': {
      bgcolor: 'primary.lighter',
      border: '1px solid',
      borderColor: 'primary.light',
      '& .MuiSvgIcon-root': {
        color: 'primary.main',
        '&:hover': {
          color: 'primary.dark'
        }
      }
    }
  }}
/>`;

  return (
    <MainCard title="Fixed Options" codeString={fixedAutocompleteCodeString}>
      <Autocomplete
        multiple
        fullWidth
        id="fixed-tags-demo"
        value={value}
        onChange={(event, newValue) => {
          setValue([...fixedOptions, ...newValue.filter((option) => fixedOptions.indexOf(option) === -1)]);
        }}
        options={data}
        getOptionLabel={(option) => option.label}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Fragment key={index}>
              <Chip label={option.label} {...getTagProps({ index })} disabled={fixedOptions.indexOf(option) !== -1} />
            </Fragment>
          ))
        }
        renderInput={(params) => <TextField {...params} placeholder="Fixed Tag" />}
        sx={{
          '& .MuiOutlinedInput-root': {
            p: 1
          },
          '& .MuiAutocomplete-tag': {
            bgcolor: 'primary.lighter',
            border: '1px solid',
            borderColor: 'primary.light',
            '& .MuiSvgIcon-root': {
              color: 'primary.main',
              '&:hover': {
                color: 'primary.dark'
              }
            }
          }
        }}
      />
    </MainCard>
  );
}