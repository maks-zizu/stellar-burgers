import { FC } from 'react';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  const { ingredients, isLoading } = useSelector((store) => store.ingredients);
  const { id } = useParams();

  if (isLoading || !ingredients.length) return <Preloader />;

  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) return <Preloader />;

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
