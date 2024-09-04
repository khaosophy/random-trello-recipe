import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';
import Layout from './components/Layout';

function App() {
  const [cards, setCards] = useState(null);
  const [randomRecipe, setRandomRecipe] = useState(null);
  let bigMeals = useRef(null);
  let leftovers = useRef(null);

  // on mount, get data from trello
  useEffect(() => {
    fetch(`https://api.trello.com/1/boards/ymfl7XFT/cards?key=${process.env.REACT_APP_TRELLO_KEY}&token=${process.env.REACT_APP_TRELLO_TOKEN}`)
      .then(res => res.json())
      .then(json => {
        setCards(json);
        bigMeals.current = json.filter(recipe => recipe.labels.find(label => label.name === "Big Meal"));
        leftovers.current = json.filter(recipe => recipe.labels.find(label => label.name === "Leftovers"));
      });
  }, []);

  // when you select a random recipe, scroll to top of page
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [randomRecipe])

  function getRandomBigMeal(){
    const randomBigMeal = bigMeals.current[Math.floor(Math.random()*bigMeals.current.length)];
    setRandomRecipe(randomBigMeal);
  }

  function getRandomLeftovers() {
    const randomLeftovers = leftovers.current[Math.floor(Math.random()*leftovers.current.length)];
    setRandomRecipe(randomLeftovers);
  }

  if(!cards) return null;
  if(!randomRecipe) {
    return (
      <Layout>
        <h1>What type of meal do you want?</h1>
        <div className="mt-3 d-flex flex-column align-items-start">
          <button
            className="btn btn-primary mb-3"
            onClick={getRandomBigMeal}
          >
            Random Big Meal
          </button>
          <button
            className="btn btn-primary"
            onClick={getRandomLeftovers}
          >
            Random Meal with Leftovers
          </button>
        </div>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <h1>{randomRecipe.name}</h1>
        <ReactMarkdown>{randomRecipe.desc}</ReactMarkdown>

        <div className="d-flex flex-column align-items-start">
          <a href={randomRecipe.url} className="btn btn-secondary mb-3">See Recipe on Trello</a>
          <button className="btn btn-primary mb-3" onClick={getRandomBigMeal}>Get a Different Big Meal</button>
          <button className="btn btn-primary" onClick={getRandomLeftovers}>Get a Different Meal with Leftovers</button>
        </div>
      </Layout>
    )
  }
}

export default App;
