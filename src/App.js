import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

function App() {
 
  const[term, setTerm] = useState("");
  const [list, setList] = useState([]);
  
  useEffect(() => {
    const searchAPI = async () => {
      const response = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          action:"query",
          format:"json",
          origin: "*",
          list: "search",
          srsearch: term,
        }
      });
      setList(response.data.query.search);
    }


    if (term && !list.length) {
      searchAPI();
    } else {
      const deobounce = setTimeout(() => {
        if(term) {
          searchAPI();
        }
      }, 1000)

      return () => {
        clearTimeout(deobounce);
        setList([])
      }
    }
  },[term, list.length])
  

  const showList = list.map((el) => {
    return (
        <tr key={el.pageid} style={{border:" 1px solid gray"}}>
          <td>{el.title}</td>
          <td>
            <span dangerouslySetInnerHTML={{__html: el.snippet}}/>
          </td>
        </tr>
    )
  })

  return (
      <Container>
        <Row className='mt-5'>
          <Col>
            <Form>
              <Form.Group className='mb-3' controlId='formBasicEmail'>
                <Form.Control
                  type="text"
                  placeholder='Search'
                  onChange={(e) => setTerm(e.target.value) }
                  value={term}
                />
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col>
            <table style={{border:" 1px solid gray"}}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {showList}
              </tbody>
            </table>
          </Col>
        </Row>
    </Container>
  );
}

export default App;
