import React, {useEffect, useState} from "react";
import {StyledButton, StyledSearchForm} from "./styles";

export default function RecipeSearchForm({
                                           name,
                                           onSearch,
                                           onClear,
                                         }: {
  name: string,
  onSearch: (event: React.SyntheticEvent, name: string) => void,
  onClear: () => void
}) {
  const [nameFormData, setNameFormData] = useState<string>(name);

  useEffect(() => {
    setNameFormData(name)
  }, [name]);

  return (
    <StyledSearchForm
      onSubmit={(event) => onSearch(event, nameFormData)}
    >
        <label htmlFor="name">Name</label>
        <input
          type='text'
          id='name'
          value={nameFormData}
          required
          onChange={(e) => setNameFormData(e.target.value)}
        />
        <StyledButton type='submit' primary={true}>Search</StyledButton>
        <StyledButton primary={false}  type="button" onClick={() => {
          setNameFormData('');
          onClear();
        }}>Clear</StyledButton>
    </StyledSearchForm>
  );
}