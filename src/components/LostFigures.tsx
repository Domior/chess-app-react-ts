import React, { FC } from 'react';
import { Figure } from '../models/figures/Figure';

interface LostFiguresProps {
  title: string;
  figures: Figure[];
}

const LostFigures: FC<LostFiguresProps> = ({ title, figures }) => {
  return (
    <div className="lost-figures">
      <h3 style={{ marginBottom: 10 }}>{title}</h3>
      {figures?.map(figure => (
        <div key={figure.id}>
          {figure.name}
          {figure.logo && (
            <img
              width={20}
              height={20}
              style={{ marginLeft: 7 }}
              src={figure.logo}
              alt={figure.name}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default LostFigures;
