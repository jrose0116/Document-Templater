// CreateModal.js

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import xss from 'xss';
import { Variable, Template } from '../../types/types';
import { toast } from 'react-toastify';

export interface Props {
  submit: (arg0: Template) => void;
  close: () => void;
  template: Template;
}

const EditModal = ({ submit, close, template }: Props) => {
  const [templateName, setTemplateName] = useState(template.name || '');
  const [templateText, setTemplateText] = useState(template.text || '');
  const [variables, setVariables] = useState<Variable[]>(template.variables || []);
  const [variableName, setVariableName] = useState('');
  const [variableValue, setVariableValue] = useState('');
  const [variableColor, setVariableColor] = useState('#ff5043')

  const addVariable = () => {
    if (variables.find((variable)=>variable.name == variableName))
      toast.error("Variable with name already exists")
    else if (variableName && variableValue) {
      setVariables((prevVariables) => [
        ...prevVariables,
        {
          name: xss(variableName),
          value: xss(variableValue),
          id: uuidv4(),
          color: xss(variableColor),
        },
      ]);
      setVariableName('');
      setVariableValue('');
      setVariableColor('#ff5043')
    }
  };

  const removeVar = (id: string) => {
    setVariables(variables.filter((variable)=>variable.id != id))
  }

  const handleSubmit = () => {
    const submitTemplate = {
      name: templateName,
      id: template.id,
      text: templateText,
      variables: [...variables],
      email: template.email,
    };

    submit(submitTemplate);

    close();
  };

  return (
    <div className="modalOverlay">
      <div className="modal">
        <div className="modalHeader">
          <h2>Edit Template</h2>
        </div>
        <label htmlFor="templateName" id='templateNameLabel'>Template Name:</label>
        <input
          type="text"
          id="templateName"
          value={templateName}
          onChange={(e) => setTemplateName(xss(e.target.value))}
        />
        <div className="modalContent">
          <div className="modalContentLeft">
            <label htmlFor="templateText">Template Text:</label>
            <textarea
              id="templateText"
              value={templateText}
              onChange={(e) => setTemplateText(xss(e.target.value))}
              />
          </div>
          <div className="modalContentRight">
            <label htmlFor="variableName">Variable Name:</label>
            <input
              type="text"
              id="variableName"
              value={variableName}
              onChange={(e) => setVariableName(xss(e.target.value))}
            />
            <label htmlFor="variableValue">Variable Value:</label>
            <input
              type="text"
              id="variableValue"
              value={variableValue}
              onChange={(e) => setVariableValue(xss(e.target.value))}
            />
            <div className='modalColorPicker'>
              <label htmlFor='variableColor' id='variableColorLabel'>Variable Color:</label>
              <input
                type="color"
                value={variableColor}
                id="variableColor"
                onChange={(e) => setVariableColor(e.target.value)}
              />
            </div>
            <button onClick={addVariable}>Add Variable</button>
            <div className="modalVariables">
              {variables.map((variable: Variable) => <div key={variable.id} className="modalVariablesItem"><div className='modalVariablesItemName' style={{color: variable.color}}>{variable.name}</div> <div className='modalVariablesItemValue'>{variable.value}</div><button onClick={()=>removeVar(variable.id)}>Remove</button></div>)}
            </div>
          </div>
        </div>
        <p className='modalInfo'>Info: When using a variable, use the variable name wrapped in 2 vertical lines. Ex: ||name||. <br />Certain characters will be sanitized which may look different in input fields!</p>
        <div className="modalFooter">
          <button onClick={handleSubmit}>Edit Template</button>
          <button onClick={close}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
