import React, { useState, useEffect } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'

import './pages.css'

function formatDate(date) {
    return date.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function getPreviousDay(date = new Date(), daysago = 0) {
    const previous = new Date(date.getTime());
    previous.setDate(date.getDate() - daysago);
    return previous;
}

let options_7days = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Number of tweets over the last 7 days',
            font: {
                size: 20,
            },
        },
    },
};

let options_3days = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Number of tweets over the last 3 days',
            font: {
                size: 20,
            },
        },
    },
};

let labels_7days = [];
let today = new Date();
for (let i=7; i>=0; i--) {
    labels_7days.push(formatDate(getPreviousDay(today, i)));
}

let labels_3days = ['12pm', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12am', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'];

function CountPage() {

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );

    const [data_7days, setData_7days] = useState({
        labels: labels_7days,
        datasets: [
            {
                label: 'No. of tweets',
                data: labels_7days.map(() => 0),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    });
    const [data_3days, setData_3days] = useState({
        labels: labels_3days,
        datasets: [
            {
                label: 'Yesterday',
                data: labels_3days.map(() => 0),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: '2 Days Ago',
                data: labels_3days.map(() => 0),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: '3 Days Ago',
                data: labels_3days.map(() => 0),
                backgroundColor: 'rgba(150, 255, 99, 0.5)',
            },
        ],
    });

    const [mean_7days, setMean_7days] = useState(0);
    const [mean_3days, setMean_3days] = useState([0, 0, 0]);
    const [total_7days, setTotal_7days] = useState(0);
    const [total_3days, setTotal_3days] = useState([0, 0, 0]);

    function getData() {
        axios.get('http://localhost:5000/keyword_7days')
            .then(res => {

                setData_7days({
                    labels: labels_7days,
                    datasets: [
                        {
                            label: 'No. of tweets',
                            data: labels_7days.map((callbackfn, idx) => res.data.data[idx].tweet_count),
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        },
                    ],
                })

                setTotal_7days(res.data.meta.total_tweet_count)
                setMean_7days(res.data.data.reduce(function (sum, current) { return sum + current.tweet_count; }, 0) / res.data.data.length)
            })

        axios.get('http://localhost:5000/keyword_daysago')
            .then(res => {

                setData_3days({
                    labels: labels_3days,
                    datasets: [
                        {
                            label: 'Yesterday',
                            data: labels_3days.map((callbackfn, idx) => res.data[0].data[idx].tweet_count),
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        },
                        {
                            label: '2 Days Ago',
                            data: labels_3days.map((callbackfn, idx) => res.data[1].data[idx].tweet_count),
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        },
                        {
                            label: '3 Days Ago',
                            data: labels_3days.map((callbackfn, idx) => res.data[2].data[idx].tweet_count),
                            backgroundColor: 'rgba(150, 255, 99, 0.5)',
                        },
                    ],
                })

                setTotal_3days([res.data[0].meta.total_tweet_count, res.data[1].meta.total_tweet_count, res.data[2].meta.total_tweet_count])
                setMean_3days([
                    res.data[0].data.reduce(function (sum, current) { return sum + current.tweet_count; }, 0) / res.data[0].data.length,
                    res.data[1].data.reduce(function (sum, current) { return sum + current.tweet_count; }, 0) / res.data[1].data.length,
                    res.data[2].data.reduce(function (sum, current) { return sum + current.tweet_count; }, 0) / res.data[2].data.length,
                ])

            })
    }

    useEffect(() => {
        getData();
    }, []);

    const [keyword, setKeyword] = useState("");
    const [language, setLanguage] = useState("none");

    function refreshData() {

        if (keyword != "") {

            axios.post('http://localhost:5000/new_search', {
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
            <div style={{ marginLeft: '5%', marginTop: '5%' }}>
                <h1>Tweet Counts</h1>

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

            <Container>
                <Row className="align-items-center">
                    <Col sm={8}>
                        <Bar options={options_7days} data={data_7days} />
                    </Col>
                    <Col sm={4} style={{ paddingLeft: '5%' }}>
                        <h4><Badge className='pinkBadge'>Total Count: </Badge> {total_7days}</h4>
                        <h4><Badge className='pinkBadge'>Mean Value: </Badge> {mean_7days}</h4>
                    </Col>
                </Row>
                <Row style={{ marginTop: '5%', marginBottom: '5%' }} className="align-items-center">
                    <Col sm={8}>
                        <Bar options={options_3days} data={data_3days} />
                    </Col>
                    <Col sm={4} style={{ paddingLeft: '5%' }}>
                        <h4><Badge className='pinkBadge'>Total Count: </Badge> {total_3days[0]}</h4>
                        <h4><Badge className='pinkBadge'>Mean Value: </Badge> {mean_3days[0]}</h4>
                        <br />
                        <h4><Badge className='blueBadge'>Total Count: </Badge> {total_3days[1]}</h4>
                        <h4><Badge className='blueBadge'>Mean Value: </Badge> {mean_3days[1]}</h4>
                        <br />
                        <h4><Badge className='greenBadge'>Total Count: </Badge> {total_3days[2]}</h4>
                        <h4><Badge className='greenBadge'>Mean Value: </Badge> {mean_3days[2]}</h4>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default CountPage