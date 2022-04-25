import style from './card.module.scss';
import { Tooltip } from '@entur/tooltip';
import { IconButton } from '@entur/button';
import { CloseIcon } from '@entur/icons';
import React, { ReactElement } from 'react';
import { Heading2, Heading3 } from '@entur/typography';
import classnames from 'classnames';

interface Props {
  handleClose?: () => void;
  children: ReactElement | ReactElement[];
  className?: string;
  title?: string;
  subTitle?: string;
}

export const Card = ({
  handleClose,
  children,
  className,
  title,
  subTitle,
}: Props) => {
  return (
    <>
      {handleClose && (
        <div className={style.closeable}>
          <Heading2>{title}</Heading2>
          <Tooltip placement="bottom" content="Lukk">
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}
      <div className={classnames(style.card, className)}>
        <Heading3>{subTitle}</Heading3>
        {children}
      </div>
    </>
  );
};
