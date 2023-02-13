import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Typography,
  DatePicker,
  Button,
  message,
} from "antd";
import { useState, useEffect } from "react";
import axios from "axios";

const { Option } = Select;
const { Title, Paragraph } = Typography;

interface Event {
  _id?: string;
  eventName: string;
  eventDetails: string;
  eventVenue: {
    address: string;
    pincode: string;
  };
  startTime: string;
  endTime: string;
}

function CheckForm() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Event>({
    eventName: "",
    eventDetails: "",
    eventVenue: {
      address: "",
      pincode: "",
    },

    startTime: "",
    endTime: "",
  });

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:3001/events");
      setEvents(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (params: any) => {
    axios
      .post("http://localhost:3001/events", {
        eventName: params.eventName,
        eventDetails: params.eventDetails,
        eventVenue: {
          address: params.address,
          pincode: params.pincode,
        },
        startTime: params.startTime,
        endTime: params.endTime,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
    fetchEvents();
  };

  const handleDelete = async (eventId: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/events/${eventId}`
      );
      fetchEvents();
      message.success(response.data.message);
    } catch (error) {
      console.error(error);
      message.error("Failed to delete event");
    }
  };

  const handleUpdate = (params: any) => {
    axios
      .put(`http://localhost:3001/events/${currentEvent._id}`, {
        eventName: params.eventName,
        eventDetails: params.eventDetails,
        eventVenue: {
          address: params.address,
          pincode: params.pincode,
        },
        startTime: params.startTime,
        endTime: params.endTime,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);
  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Row
      gutter={16}
      style={{ height: "100vh", padding: "1rem" }}
      align={"middle"}
    >
      <Col span={14}>
        <>
          {events.map((event: any, index: number) => (
            <Row key={index} align="middle">
              <Col span={8}>
                Event Name: {event.eventName}
                <br />{" "}
                <Typography.Text style={{ fontSize: "0.8rem" }}>
                  {event.eventVenue.address}, {event.eventVenue.details}
                </Typography.Text>
              </Col>
              <Col span={4}>{event.startTime}</Col>
              {/* <Col span={4}>{event.endTime}</Col> */}
              <Row gutter={10}>
                <Col>
                  <Button
                    type="primary"
                    danger
                    onClick={() => handleDelete(event._id as string)}
                  >
                    Delete
                  </Button>
                </Col>
                <Col>
                  <Button
                    onClick={() => {
                      console.log(event);
                      setCurrentEvent(event);
                    }}
                    type="primary"
                  >
                    Update
                  </Button>
                </Col>
              </Row>
            </Row>
          ))}
        </>
      </Col>
      <Col span={10}>
        <Form onFinish={handleSubmit} initialValues={currentEvent}>
          <Form.Item label="Event Name" name={"eventName"}>
            <Input placeholder="Enter event name" />
          </Form.Item>
          <Form.Item label="Event Details" name={"eventDetails"}>
            <Input placeholder="Enter event details" />
          </Form.Item>
          <Form.Item label="Event Venue" name={"address"}>
            <Input placeholder="Enter event address" />
          </Form.Item>
          <Form.Item label="Event Pincode" name={"pincode"}>
            <Input placeholder="Enter event pincode" />
          </Form.Item>
          <Form.Item label="Event start time" name={"startTime"}>
            <DatePicker showTime />
          </Form.Item>
          <Form.Item label="Event end time" name={"endTime"}>
            <DatePicker showTime />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}

export default CheckForm;
