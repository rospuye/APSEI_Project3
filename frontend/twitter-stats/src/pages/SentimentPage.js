import React, { useState, useEffect } from 'react'
import axios from 'axios';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function SentimentPage() {

    ChartJS.register(ArcElement, Tooltip, Legend);

    const [keyword, setKeyword] = useState("");
    const [language, setLanguage] = useState("none");

    const [rawData, setRawData] = useState({});

    const [data, setData] = useState({
        labels: ['Negative', 'Neutral', 'Positive'],
        datasets: [
            {
                data: [0,0,0],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
            },
        ],
    })

    function getData() {
        axios.get('http://localhost:5000/sentiment')
            .then(res => {

                console.log(res.data.data)
                setRawData(res.data.data)

                let neg = 0;
                let neu = 0;
                let pos = 0;
                for (let tweet of res.data.data) {
                    if (tweet.polarity == 0) {
                        neg++;
                    }
                    else if (tweet.polarity == 2) {
                        neu++;
                    }
                    else if (tweet.polarity == 4) {
                        pos++;
                    }
                }

                setData({
                    labels: ['Negative', 'Neutral', 'Positive'],
                    datasets: [
                        {
                            data: [neg, neu, pos],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(75, 192, 192, 1)',
                            ],
                            borderWidth: 1,
                        },
                    ],
                })

            })
    }

    useEffect(() => {
        getData();
    }, []);

    function refreshData() {
        if (keyword != "") {

            axios.post('http://localhost:5000/new_sentiment_search', {
                keyword: keyword,
                language: language
            })
                .then(function (res) {
                    console.log(res);
                    if (res.status == 200) {
                        getData();
                    }
                })
        }
    }

    return (
        <>
            <Container>
                <Row className="justify-content-center">
                    <Col sm={4}>
                        <div style={{ marginLeft: '5%', marginTop: '5%' }}>
                            <h1>Sentiment Analysis</h1>

                            <input style={{ marginTop: '2%' }} type="text" placeholder="Give a keyword..." onChange={(e) => { setKeyword(e.target.value) }} />
                            <button onClick={(e) => { refreshData() }}>Search</button>
                            <br />
                            <input style={{ marginTop: '1%' }} type="radio" id="en" name="language" onChange={(e) => { if (e.target.checked) { setLanguage("en") } }} />
                            <label htmlFor="en">English</label><br />
                            <input type="radio" id="pt" name="language" onChange={(e) => { if (e.target.checked) { setLanguage("pt") } }} />
                            <label htmlFor="pt">Portuguese</label><br />
                            <input type="radio" id="none" name="language" onChange={(e) => { if (e.target.checked) { setLanguage("none") } }} />
                            <label htmlFor="none">No language preference</label><br /><br />
                        </div>
                        
                    </Col>
                    <Col sm={8} style={{ paddingTop: '5%', paddingLeft: '10%' }}>
                        <div id="chart-wrapper">
                            <Pie data={data} />
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default SentimentPage