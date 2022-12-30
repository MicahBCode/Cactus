import React, { useEffect, useState } from "react";
import Alert from "../components/Alert";
import LabPathDisplay from "../components/LabPathDisplay";
import LinkButton from "../components/LinkButton";
import SpecifyTestButton from "../components/SpecifyTestButton";
import { getLibrary } from "../services/api";
import { criteriaCatalogue } from "../services/criteria";
import { library, testData } from "../types";

type SpecifyTestProps = {
  testData: testData;
  setTestData: Function;
};

const SpecifyTest = ({ testData, setTestData }: SpecifyTestProps) => {
  // const criteriaData = criteriaCatalogue;
  // const components = criteriaData.map((item) => item.component);
  const components = criteriaCatalogue;
  const testModes = ["Keyboard", "Screenreader"];
  const [library, setLibrary] = useState<library | undefined>();

  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    if (testData.libraryId) {
      getLibrary(testData.libraryId).then((lib: library) => {
        setLibrary(lib);
      });
    }
  }, [testData.libraryId]);

  useEffect(() => {
    if (testData.component === "" || testData.testMode === "") {
      setFormValid(false);
    } else {
      setFormValid(true);
    }
  }, [testData]);

  const handleChange = (
    component: string,
    alternativeComponentNames: string,
    testMode: string
  ) => {
    setTestData({
      ...testData,
      component: component,
      alternativeComponentNames: alternativeComponentNames,
      testMode: testMode,
    });
  };

  return (
    <div className='lab-start'>
      <LabPathDisplay currentPage='specify' />
      <Alert type='help' message='Choose Component and Testmode to continue.' />
      <p>There are two testmodes for every component:</p>
      <p>
        <strong>Keyboard:</strong> this focuses on accessibility with keyboard
        use and screen, for example to use the 'enter'-key to click a button.
      </p>
      <p>
        <strong>Screenreader</strong>: this focuses on accessibility with a
        screenreader, for example to read an alt-text. Please use chrome and
        NVDA for this test.
      </p>
      <p>Each testmode displays the amount of tests that were already done.</p>
      <p>Choose one to continue.</p>

      {components.map((component) => (
        <div key={component.component} className='specify-component'>
          <div className='specify-component-header'>
            <h3>{component.component}</h3>
            <p>{component.alternativeComponentNames}</p>
          </div>
          <div className='specify-component-options'>
            {testModes.map((testMode) => (
              <div key={`${component}-${testMode}`}>
                <SpecifyTestButton
                  testData={testData}
                  testMode={testMode}
                  component={component}
                  handleChange={handleChange}
                  amountOfTests={
                    library?.versions
                      .find(
                        (version) => version.version === testData.libraryVersion
                      )
                      ?.components.find(
                        (foundComponent) =>
                          foundComponent.name === component.component
                      )
                      ?.modes.find((mode) => mode.name === testMode)?.testScores
                      .amountOfTests || 0
                  }
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className='control-group'>
        <LinkButton label={"Back"} to={"../start"} />
        <LinkButton
          disabled={!formValid}
          label='Next'
          className='button-primary'
          to='../test'
        ></LinkButton>
        {!formValid && <p className='text-red'>Please choose a test.</p>}
      </div>
    </div>
  );
};

export default SpecifyTest;
