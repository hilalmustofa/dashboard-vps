import React, { useState } from 'react';

interface Option {
  value: string;
  label: string;
}

interface Question {
  key: string; 
  question: string;
  options: Option[];
}

interface QuestionGroup {
  name: string;
  options: Question[];
}

interface RadioButtonGroupProps {
  data: QuestionGroup[];
  onOptionChange: (key: string, value: string) => void;
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({ data, onOptionChange }) => {
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});

  const handleOptionChange = (key: string, value: string) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [key]: value,
    }));
    onOptionChange(key, value);
  };

  return (
    <div>
      {data.map((questionGroup, index) => (
        <div key={index}>
          <label className="block text-[14px] font-medium mt-4 mb-4">{questionGroup.name}</label>
          <div className="mt-2 space-y-2">
            {questionGroup.options.map((question) => (
              <div key={question.key} className="mb-6">
                <p className="block text-[13px] font-medium text-gray-800 mb-4">{question.question}</p>
                {question.options.map((option) => (
                  <div key={option.value} className="flex items-center mb-4">
                    <input
                      type="radio"
                      style={{ width: '15px', height: '15px' }} 
                      required
                      id={`${question.key}-${option.value}`}
                      name={question.key}
                      value={option.value}
                      className="mr-2"
                      checked={selectedOptions[question.key] === option.value}
                      onChange={() => handleOptionChange(question.key, option.value)}
                    />
                    <label htmlFor={`${question.key}-${option.value}`} className="text-[13px]">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RadioButtonGroup;
