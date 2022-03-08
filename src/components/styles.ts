import styled, {createGlobalStyle} from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  body {
    line-height: 1.6;
    font-weight: 400;
    font-size: 1em;
    font-family: Raleway,HelveticaNeue,"Helvetica Neue",Helvetica,Arial,sans-serif;
  }
`

export const StyledButton = styled.button<{ primary: boolean | null }>`
  background: ${props => props.primary ? "#6f859e" : "white"};
  color: ${props => props.primary ? "white" : "#6f859e"};

  font-family: inherit;
  font-size: inherit;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #6f859e;
  border-radius: 3px;
`

export const StyledTable = styled.table`
    border-collapse: separate;
    text-indent: initial;
    border-spacing: 2px;
    color: "#6f859e";
`;

export const THead = styled.thead`
    display: table-header-group;
    vertical-align: middle;
    border-color: inherit;
`;

export const TFoot = styled.tfoot`
  // custom css goes here
`;

export const TBody = styled.tbody`
 // custom css goes here
`;

export const TR = styled.tr`
`;

export const TH = styled.th`
    display: table-cell;
    vertical-align: inherit;
    font-weight: bold;
`;

export const TD = styled.td`
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #E1E1E1;
`;

export const StyledSearchForm = styled.form`

input {
  min-width: 1
  00px;
  margin: 0 1em;
  padding: 0.25em 1em;
}
`

export const StyledRecipeForm = styled.form`
input, label {
    display:block;
}
label {
  margin-top: 1em;
}

input, textarea {
   padding: 0.25em 1em;
   font-family: inherit;
   font-size: inherit;
}
`

export const InlineBlock = styled.div`
  display:inline-grid;
  margin-right: 1em;
`

export const ErrorMessage = styled.div`
  color: red
`
