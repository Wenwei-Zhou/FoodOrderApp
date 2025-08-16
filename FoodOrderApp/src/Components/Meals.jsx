import MealItem from "./MealItem.jsx";
import useHttp from "./hooks/useHttp.js";
import Error from "./Error.jsx";

const requestConfig = {};

export default function Meals() {
  const {
    data: loadedMeals,
    isLoading,
    error,
  } = useHttp("http://localhost:3000/meals", requestConfig, []);

  if (isLoading) {
    return <p className="center">Fetching meals...</p>;
  }
  // 读取数据时isLoading = true，然后return <p>Fetching meals...</p>。网页显示Fetching meals...

  if (error) {
    return <Error title="Failed to fetch meals" message={error} />;
  } //如果有错误，显示Error component，用来展示错误信息。

  // 原来没有useHttp.js，直接在Meal component里面fetch data
  // const [loadedMeals, setLoadedMeals] = useState([]);

  // useEffect(() => {
  //   async function fetchMeals() {
  //       // try {
  //       //     const response = await fetch('http://localhost:3000/meals');

  //       // } catch (error) {

  //       // }

  //       const response = await fetch("http://localhost:3000/meals");

  //       if (!response.ok) {
  //       }

  //       const meals = await response.json();
  //       setLoadedMeals(meals);
  //   }

  //   fetchMeals();
  // }, [])

  return (
    <ul id="meals">
      {loadedMeals.map((meal) => (
        <MealItem key={meal.id} meal={meal} />
      ))}
    </ul>
  );
}
