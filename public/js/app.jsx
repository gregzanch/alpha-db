const { createContext, useReducer, useState, useContext } = React;


function getSearchQueryParams() {
	const searchParams = new URLSearchParams(window.location.search);
	if (searchParams.has("query")) {
		return searchParams.get("query");
	} else return "";
}

function getQueryUrl(props) {
  const obj = {
    description: { $regex: ".*" + props.query + ".*", $options: "i" },
    // tags: { $in: tags },
  };
  props.tags.length > 0 && (obj.tags = { $in: props.tags });
  const params = new URLSearchParams();
  
  params.set('obj', JSON.stringify(obj));
  params.set('skip', props.skip || 0);
  params.set('limit', props.limit || 25);
  
  if (props.select) {
    params.set('select', props.select);
  }
  
  const url = '/api/material/find?' + params.toString();

	return url;
}

async function fetchResults(props) {
	return new Promise((resolve, reject) => {
		fetch(getQueryUrl(props))
			.then((res) => res.json())
			.then(resolve)
			.catch(reject);
	});
}


const GlobalReducer = (state, action) => {
	switch (action.type) {
		case "SET_LIMIT":
			return {
				...state,
				limit: action.payload
      };
		case "SET_QUERY":
			return {
        ...state,
        query: action.payload
      };
		case "SET_SKIP":
			return {
				...state,
				skip: action.payload
      };
    case "ADD_TAG":
      if (!state.tags.includes(action.payload)) {
        return {
          ...state,
          tags: state.tags.concat(action.payload)
        };
      }
      return state;
    case "REMOVE_TAG": 
      return {
        ...state,
        tags: state.tags.filter(x => x !== action.payload)
      }
    case "SET_SHOULD_FETCH": 
      return {
        ...state,
        shouldFetch: action.payload
      }
    case "ADD_RESULTS": 
      return {
        ...state,
        results: state.results.concat(action.payload),
        skip: state.skip + action.payload.length,
        shouldFetch: false
      }
    case "SET_RESULTS": 
      return {
        ...state,
        results: action.payload,
        skip: action.payload.length,
        shouldFetch: false
      }
		default:
			return state;
	}
};

const query = getSearchQueryParams();

const initialState = {
	query: query,
	limit: 10,
	skip: 0,
	tags: [],
  shouldFetch: true,
	results: []
};


const EagerReducer = (state, action) => {
  switch (action.type) {
    case "SET_EAGER_QUERY":
      return {
        ...state,
        eagerQuery: action.payload,
      };
    default:
      return state;
  }
}

const _eagerState = {
	eagerQuery: query,
};

const EagerContext = createContext(_eagerState);

function EagerProvider({ children }) {
	const [state, dispatch] = useReducer(EagerReducer, _eagerState);


  function setEagerQuery(query) {
		dispatch({
			type: "SET_EAGER_QUERY",
			payload: query,
		});
  }

	return (
		<EagerContext.Provider value={{ eagerQuery: state.eagerQuery, setEagerQuery }}>
			{children}
		</EagerContext.Provider>
	);
}


const BriefReducer = (state, action) => {
  switch (action.type) {
		case "SET_BRIEF":
			return {
				...state,
				brief: action.payload,
			};
		default:
			return state;
  }
}

const _briefState = {
  brief: []
}

const BriefContext = createContext(_briefState);

function BriefProvider({ children }) {
  const [state, dispatch] = useReducer(BriefReducer, _briefState);
  
  function setBrief(brief) {
    dispatch({
      type: 'SET_BRIEF',
      payload: brief
    });
  }
  
  return (
		<BriefContext.Provider value={{ brief: state.brief, setBrief }}>
			{children}
		</BriefContext.Provider>
	);
  
}



const GlobalContext = createContext(initialState);

function GlobalProvider({ children }) {
  const [state, dispatch] = useReducer(GlobalReducer, initialState);

  
  function setLimit(limit) {
    dispatch({
      type: 'SET_LIMIT',
      payload: limit || 10
    });
  }
  function setSkip(skip) {
    dispatch({
      type: 'SET_SKIP',
      payload: skip || 0
    });
  }
  function addTag(tag) {
    dispatch({
      type: 'ADD_TAG',
      payload: tag
    });
  }
  function removeTag(tag) {
    dispatch({
      type: 'REMOVE_TAG',
      payload: tag
    });
  }
  
  function setShouldFetch(shouldFetch) {
    dispatch({
      type: "SET_SHOULD_FETCH",
      payload: shouldFetch
    })
  }
  
  function addResults(results) {
    dispatch({
      type: "ADD_RESULTS",
      payload: results
    })
  }

  function setResults(results) {
    dispatch({
      type: "SET_RESULTS",
      payload: results
    })
  }
  function setQuery(query) {
    dispatch({
      type: "SET_QUERY",
      payload: query
    })
  }


  
  return (
		<GlobalContext.Provider
			value={{
				query: state.query,
				limit: state.limit,
				skip: state.skip,
				tags: state.tags,
				shouldFetch: state.shouldFetch,
        results: state.results,
				setLimit,
				setSkip,
				addTag,
				removeTag,
				setShouldFetch,
				addResults,
        setResults,
        setQuery
			}}>
			{children}
		</GlobalContext.Provider>
  );
}


function LogoIcon(props) {
  const mainColor = props.mainColor || "rgb(75, 75, 75)";
  const tailColor = props.tailColor || "rgb(200, 200, 200)";
  return (
		<svg
			width="32"
			height="23"
			viewBox="0 0 32 23"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.2242 5.62637C21.6381 3.89158 19.833 0 15.1209 0C7.03297 0 0 8.39348 0 14.9099C0 21.1692 5.32752 22.7165 8.86154 22.7165C13.0632 22.7165 16.7195 21.2696 21.0286 16.2462C21.4037 18.4029 22.5758 22.6462 27.0769 22.6462C29.6791 22.6462 31.5077 21.0989 32 20.3253H29.3978C26.6261 20.3253 25.5832 16.8221 24.6957 13.8409C24.4797 13.1155 24.273 12.421 24.0527 11.8154L30.8747 0.984615L25.178 0.984615L22.2242 5.62637ZM19.2703 10.6901C18.9187 8.22857 17.5121 4.85275 13.8549 4.85275C9.84615 4.85275 3.44765 10.4088 5.97802 16.6681C8.65055 23.2791 17.3011 14.9099 19.2703 10.6901Z"
        fill={mainColor}
			/>
			<path
        d="M32 20.3253C31.5077 21.0989 29.6791 22.6462 27.0769 22.6462C25.905 22.6462 24.9587 22.3585 24.1934 21.8949C24.0762 21.7563 23.9268 21.4593 24.2081 21.178C24.4894 20.8967 24.8411 21.2484 25.1224 20.967C25.4037 20.6857 24.8995 20.5397 24.9817 20.3341C25.1224 19.9824 25.896 20.3341 26.2476 19.9121C26.5359 19.5661 26.0709 18.5929 26.2306 18.0044C26.9608 19.3565 27.9403 20.3253 29.3978 20.3253H32Z"
        fill={tailColor}
			/>
		</svg>
  );
}

function IconButton(props) {
  const className = [
    "icon-button",
    props.minimal && "minimal" || "",
    props.className || "",
  ].join(" ").trimRight();
  const buttonprops = {
    className,
  }
  if (props.type) {
    buttonprops.type = props.type;
  }
  return <button {...buttonprops}>{props.icon}</button>;
}


function SearchIcon(props) {
  return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			aria-hidden="true"
			focusable="false"
			style={{
				width: "1.5em",
				height: "1.5em",
				msTransform: "rotate(360deg)",
				WebkitTransform: "rotate(360deg)",
				transform: "rotate(360deg)",
			}}
			preserveAspectRatio="xMidYMid meet"
			viewBox="0 0 24 24">
			<path
				d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14z"
				fill="#626262"
			/>
			<rect x="0" y="0" width="24" height="24" fill="rgba(0, 0, 0, 0)" />
		</svg>
  );
}
function CogIcon(props) {
  return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			aria-hidden="true"
			focusable="false"
			style={{
				width: "1.5em",
				height: "1.5em",
				msTransform: "rotate(360deg)",
				WebkitTransform: "rotate(360deg)",
				transform: "rotate(360deg)",
			}}
			preserveAspectRatio="xMidYMid meet"
			viewBox="0 0 24 24">
			<path
				d="M19.14 12.94c.04-.3.06-.61.06-.94c0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6s3.6 1.62 3.6 3.6s-1.62 3.6-3.6 3.6z"
				fill="#626262"
			/>
			<rect x="0" y="0" width="24" height="24" fill="rgba(0, 0, 0, 0)" />
		</svg>
  );
}

function Search(props) {
  const { eagerQuery, setEagerQuery } = useContext(EagerContext);
  const handleChange = (e) => {
		setEagerQuery(e.currentTarget.value);
	};
  return (
		<input
			className="search-input fill-height"
			type="search"
			onChange={handleChange}
			value={eagerQuery}
		/>
  );
}

function SearchBar(props) {
  
  const { limit, tags, setResults, setQuery } = useContext(GlobalContext);
 

  
  const handleSubmit = e => {
    console.log(e.currentTarget);
    const query = e.currentTarget.querySelector('input[type="search"').value;
    fetchResults({ query, skip: 0, limit, tags })
		.then((res) => {
			console.log(res);
      setResults(res);
      setQuery(query);
		})
		.catch(console.error);
    e.preventDefault();
  }
  
  return (
		<form onSubmit={handleSubmit}>
      <div className="search">
        <Search />
				<IconButton className="fill-height" icon={<SearchIcon />} type="submit"/>
			</div>
		</form>
  );
}


function NavBar(props) {
  return (
		<div className="nav-bar">
      <IconButton icon={<LogoIcon />} minimal/>
      <SearchBar />
      <IconButton icon={<CogIcon />} minimal/>
		</div>
  );
}

function EagerResults(props) {
  const { brief, setBrief } = useContext(BriefContext);
  const { eagerQuery, setEagerQuery } = useContext(EagerContext);
  
	if (brief.length == 0) {
		fetch("/api/material/brief")
			.then((res) => res.json())
			.then((res) => setBrief(res))
			.catch(console.error);
  }
  return (
    <div className="eager-results">
      
    </div>
  )
}



function TinyBarChart(props){
  return (
		<Recharts.AreaChart
			width={200}
			height={60}
			data={props.data}
			margin={{
				top: 5,
				right: 0,
				left: 0,
				bottom: 5,
			}}>
			<Recharts.Area
				type="monotone"
				dataKey="α"
				stroke="#8884d8"
				fill="#8884d8"
			/>
		</Recharts.AreaChart>
  );
}


function Material(props) {
  const material = props.material;
  const data = Object.keys(material.absorption).map(freq => {
    return {
      name: freq,
      α: material.absorption[freq]
    }
  });
  return (
		<div className="material-container">
			<TinyBarChart data={data} />
			<div className="material-details">
        <div className="material-title">{material.description}</div>
        <div className="material-manufacturer">{material.manufacturer}</div>
			</div>
		</div>
  );
}



function SearchResults(props) {
  const { query, results, addResults, limit, skip, tags, shouldFetch, setShouldFetch } = useContext(GlobalContext);


  if (shouldFetch) {
    fetchResults({
      query, skip, limit, tags
    }).then(res => {
      addResults(res);
      console.log(res);
    }).catch(console.error);
  }
  return (
		<div>
			<div className="search-results">
				{results.map((result) => (
					<Material key={result._id} material={result} />
				))}
			</div>
			<button onClick={(e) => setShouldFetch(true)}>More</button>
		</div>
  );
}

function App(props) {
  

  
  return (
    <div id="app">
      <NavBar />
      <EagerResults />
      <SearchResults />
    </div>
  )
}


ReactDOM.render(
  <GlobalProvider>
    <BriefProvider>
      <EagerProvider>
        <App/>
      </EagerProvider>
    </BriefProvider>
  </GlobalProvider>,
	document.getElementById("root")
);