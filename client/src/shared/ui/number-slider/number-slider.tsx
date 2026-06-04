import { cx } from '../../lib/cx';
import { Input } from '../input';
import './number-slider.scss';

interface NumberSliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  isDisabled?: boolean;
  label?: string;
  className?: string;
}

const NumberSlider = ({ value, min, max, onChange, isDisabled, label, className }: NumberSliderProps) => {
  // #region HANDLER
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) onChange(Math.min(max, Math.max(min, val)));
  };

  const handleRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value, 10));
  };
  // #endregion

  return (
    <div className={cx('number-slider-field', className)}>
      {label && <span className="number-slider-field__label">{label}</span>}
      <div className="number-slider">
        <Input
          type="number"
          className="number-slider__input"
          value={value}
          min={min}
          max={max}
          onChange={handleInput}
          isDisabled={isDisabled}
        />
        <input
          type="range"
          className="number-slider__range"
          value={value}
          min={min}
          max={max}
          onChange={handleRange}
          disabled={isDisabled}
        />
      </div>
    </div>
  );
};

export { NumberSlider };
