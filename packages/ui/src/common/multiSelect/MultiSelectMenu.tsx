import React = require('react');
import {
  ReactNode,
  SyntheticEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { MultiselectOption } from './MultiselectOption';
import { BodyEnd } from '../BodyEnd';
import {
  StylesContext,
  StylesContextProvider,
} from '../styles/StylesContextProvider';
import { FONT_FAMILY } from '../constants';

export const MultiSelectMenu = <Option,>(props: {
  anchorEl?: HTMLElement;
  options: Option[];
  label: string;
  value: Option[];
  renderOption: (o: Option) => ReactNode;
  onChange: (e: SyntheticEvent, value: Option[]) => void;
  renderValues: (options: Option[]) => ReactNode;
  children?: undefined;
  onClose: () => void;
}) => {
  const ref = useRef();
  const getTop = () =>
    props.anchorEl?.offsetTop + props.anchorEl?.clientHeight + 5 || undefined;

  const [top, setTop] = useState(getTop());

  const isOptionSelected = (o: Option) => props.value.indexOf(o) > -1;

  const onOptionToggle = (e: SyntheticEvent, o: Option) => {
    const index = props.value.indexOf(o);
    if (index > -1) {
      props.value.splice(index, 1);
      props.onChange(e, props.value);
    } else {
      props.onChange(e, [...props.value, o]);
    }
  };

  const styleContext = useContext(StylesContext);

  //check for top offset change
  useEffect(() => {
    if (props.anchorEl) {
      let interval;
      const adjustTop = () =>
        (interval = setTimeout(() => {
          setTop(getTop());
          adjustTop();
        }, 50));
      adjustTop();
      return () => clearTimeout(interval);
    }
  }, [props.anchorEl]);

  if (!props.anchorEl) {
    return null;
  }

  const width = props.anchorEl.clientWidth;
  const left = (props.anchorEl as HTMLElement).offsetLeft;

  return (
    <BodyEnd document={props.anchorEl.ownerDocument}>
      <StylesContextProvider insertionPoint={styleContext.insertionPoint}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 2147483001,
            fontFamily: FONT_FAMILY,
          }}
          onClick={props.onClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            ref={ref}
            style={{
              width: width,
              top: top,
              left: left,
              position: 'absolute',
              visibility: top !== undefined ? 'visible' : 'hidden',
              zIndex: 2147483002,
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '5px',
                fontSize: '1rem',
                boxShadow:
                  '0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)',
              }}
            >
              {props.options.map((o, index) => (
                <MultiselectOption
                  key={index}
                  option={o}
                  selected={isOptionSelected(o)}
                  renderOption={props.renderOption}
                  onToggle={(e) => onOptionToggle(e, o)}
                />
              ))}
            </div>
          </div>
        </div>
      </StylesContextProvider>
    </BodyEnd>
  );
};
