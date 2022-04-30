import React, {useState, useEffect} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import '../App.css';
import Axios from 'axios';
import { Card, Button, Spinner } from 'react-bootstrap';

var articleData = [];
var found = false;
var lastFetchedArticleItemId = 1;

export default function Article(){

    const [getData, setData] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
      lastFetchedArticleItemId = 1;
    }, []);

    const fetchMoreData = () => {
      setTimeout(() => {
        
         Axios.get('https://nodejs-server-test-app.herokuapp.com/api/get/article', {
          headers: {
            'content-type': "application/json",
            'item': lastFetchedArticleItemId
          }
        }).then((res) => { 
        
            try {
                if (res.status !== 200) {
                    console.log('not200');
                    setHasMore(false);
                    found=false;
                } else {
                    const jsonRes = res.data;
                    console.log(articleData);
                    console.log(lastFetchedArticleItemId + " " + jsonRes.length);
                    setHasMore(true);
                    found=true;
                    console.log("Message: " + JSON.stringify(res.status));
                    var articleResultId = 0;
                    for (articleResultId = 0; articleResultId < jsonRes.length; articleResultId++){
                        articleData.push(jsonRes[articleResultId]);
                    };
                    setData(
                      getData.concat(Array.from({ length: articleResultId }))
                    );
                    lastFetchedArticleItemId= lastFetchedArticleItemId+jsonRes.length
                    console.log(lastFetchedArticleItemId);
                  }
            } catch (err) {
                //console.log(err);
            };
        })
        .catch(err => {
          if (err.response.status === 404 ){
            setHasMore(false);
          }
            //console.log(err);
        });        
      }, 1)
    };

    return(
      <div className="infiniteScrollContainer">
        <InfiniteScroll
          dataLength={getData.length}
          next={fetchMoreData()}
          hasMore={hasMore}
          loader={<div className="text-center mb-5">
            <Button variant="primary" disabled>
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />
              Loading...
            </Button>
          </div>}
        >
           { found === true ?
              getData.map((index, i) => (
                <CardContainer key={i} item={index} data={articleData[i]}/>
              ))
          : null}
        </InfiniteScroll>
      </div>
    );
}

class CardContainer extends React.PureComponent {    

  render() {
      const {data} = this.props;
      return(
          <Card style={{backgroundImage: `url(${data.ArticleImg})`, backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          color: 'white'
          }} className="text-center m-5 bg-dark">
            <Card.Header className="bg-black bg-opacity-75">{data.ArticleName}</Card.Header>
            <Card.Body className="bg-black bg-opacity-50">
              <Card.Title>{data.ArticleSmDescr}</Card.Title>
              <Card.Text>
                {data.ArticleMDescr}
              </Card.Text>
            </Card.Body>
            <Card.Footer className="bg-black bg-opacity-50">Created at: {data.ArticleCreatedAt}</Card.Footer>
          </Card>
      )
  }
}
