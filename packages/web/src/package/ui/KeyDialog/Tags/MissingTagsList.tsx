import React from 'react';
import { MissingTag } from './MissingTag';

type Props = {
  tags: string[];
};

export const MissingTagsList = ({ tags }: Props) => {
  return (
    <>
      {tags.map((tag, index) => {
        if (index === 0) {
          return (
            <React.Fragment key={tag}>
              <MissingTag name={tag} />
            </React.Fragment>
          );
        } else if (index < tags.length - 1) {
          return (
            <React.Fragment key={tag}>
              , <MissingTag name={tag} />
            </React.Fragment>
          );
        } else {
          return (
            <React.Fragment key={tag}>
              {' '}
              or <MissingTag name={tag} />
            </React.Fragment>
          );
        }
      })}
    </>
  );
};
