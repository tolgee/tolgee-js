import React from 'react';
import './App.css';
import {PolygloatProvider} from "@polygloat/react";
import {UI} from "@polygloat/ui"
import {Page} from "./Page";


const App = () => {
    return (
        <PolygloatProvider
            filesUrlPrefix="i18n/"
            apiUrl={process.env.REACT_APP_POLYGLOAT_API_URL}
            apiKey={process.env.REACT_APP_POLYGLOAT_API_KEY}
            ui={UI}
            availableLanguages={["en", "de"]}
            loadingFallback={
                <div style={{
                    display: "flex",
                    height: "100vh",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    Loading...
                </div>
            }
        >
            <div style={{
                width: "800px",
                margin: "0 auto 0 auto",
                textAlign: "center",
                paddingTop: "20px"
            }}>
                <Page/>
            </div>
        </PolygloatProvider>
    )
};

export default App;
