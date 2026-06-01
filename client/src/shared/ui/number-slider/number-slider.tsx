import { Input } from '../input';
import './number-slider.scss';

interface NumberSliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  isDisabled?: boolean;
}

const NumberSlider = ({ value, min, max, onChange, isDisabled }: NumberSliderProps) => {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) onChange(Math.min(max, Math.max(min, val)));
  };

  const handleRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value, 10));
  };

  return (
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
        isDisabled={isDisabled}
      />
    </div>
  );
};

export { NumberSlider };
