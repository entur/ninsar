import style from './card.module.scss';
import { Button } from '@entur/button';
import { BackArrowIcon } from '@entur/icons';
import React, { ReactElement } from 'react';
import { Heading2, Heading3 } from '@entur/typography';
import classnames from 'classnames';
import { titleText } from "../../lineStatistics.constants";
import { useLocale } from "../../../appContext";

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

  const locale = useLocale();

  return (
    <>
      {handleClose && (
        <div className={style.closeable}>
          <Button
            width="auto"
            variant="tertiary"
            size="medium"
            onClick={handleClose}
          >
            <BackArrowIcon /> {titleText(locale).back}
          </Button>
          {title && <Heading2>{title}</Heading2>}
        </div>
      )}
      <div className={classnames(style.card, className)}>
        {subTitle && <Heading3>{subTitle}</Heading3>}
        {children}
      </div>
    </>
  );
};
