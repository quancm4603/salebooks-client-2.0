import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function CustomerOrderHistory({ customerId }) {
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const response = await axios.get(`https://localhost:7196/api/Customer/${customerId}/quotations`);
                setOrderHistory(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching order history:', error);
            }
        };

        fetchOrderHistory();
    }, [customerId]);

    if (loading) {
        return <div>Loading order history...</div>;
    }

    function formatDate(dateTimeString) {
        const date = new Date(dateTimeString);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Tháng bắt đầu từ 0, nên cần cộng thêm 1
        const year = date.getFullYear();

        // Đảm bảo rằng ngày và tháng đều có 2 chữ số
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;

        return `${formattedDay}/${formattedMonth}/${year}`;
    }

    const bull = (
        <Box
            component="span"
            sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
        >
            •
        </Box>
    );

    return (
        <div   >
            {/* <h2>Order History for Customer ID: {customerId}</h2> */}
           
            <ul style={{ listStyle: 'none', padding: 0, maxHeight: '525px', overflowY: 'auto' }}>

                {orderHistory.map((order, index) => (
                    <li key={index}>
                        {/* Order ID: {order.id}, Date: {formatDate(order.createdAt)}, Total: {order.total} */}
                        <Box sx={{ minWidth: 275 }}>
                            {/* <Card variant="outlined">Order ID: {order.id}, Date: {formatDate(order.createdAt)}, Total: {order.total}</Card> */}



                            <Card variant="outlined" sx={{ minWidth: 275 }} style={{ marginBottom: 10 }} >
                                <CardContent>
                                  
                                    <Typography variant="h5" component="div">
                                    Date: {formatDate(order.createdAt)}
                                    </Typography>
                                    <Typography variant="h5" component="div">
                                    Total: {order.total}
                                    </Typography>
                                   
                                </CardContent>
                                <CardActions>
                                    <Button size="small">Detail Order</Button>
                                </CardActions>
                            </Card>

                        </Box>
                    </li>


                ))}
            </ul>
        </div>
    );
}

CustomerOrderHistory.propTypes = {
    customerId: PropTypes.number.isRequired,
};

export default CustomerOrderHistory;
