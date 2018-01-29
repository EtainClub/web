import React, { PureComponent } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FormattedRelative } from 'react-intl';
import Body from 'components/Body';

import { List, Avatar, Button, Spin } from 'antd';

import { sortCommentsFromSteem } from 'utils/helpers/stateHelpers';
import ContentPayoutAndVotes from 'components/ContentPayoutAndVotes';
import AvatarSteemit from 'components/AvatarSteemit';
import Author from 'components/Author';
import ReplyButton from 'components/ReplyButton';
import CommentReplyForm from './CommentReplyForm';

class CommentItem extends PureComponent {
  constructor() {
    super();
    this.state = {
      showReplyForm: false,
      isEditing: false,
    };
  }

  closeReplyForm = () => {
    this.setState({ showReplyForm: false });
  };

  switchReplyForm = () => {
    this.setState({ showReplyForm: !this.state.showReplyForm });
  };

  render() {
    const { comment, commentsChild, commentsData, sortOrder } = this.props;
    const { showReplyForm } = this.state;

    if (!comment) {
      return null;
    }

    return (
      <List.Item
        actions={[
          <ContentPayoutAndVotes type="comment" content={comment} />,
          <a>vote</a>,
          <a onClick={this.switchReplyForm}>reply</a>
        ]}>
        <List.Item.Meta
          avatar={<Avatar src={`${process.env.REACT_APP_STEEMCONNECT_IMG_HOST}/@${comment.author}?s=120`} />}
          title={
            <div className="comment-title">
              <Author name={comment.author} />
              <span className="separator">&middot;</span>
              <span className="date"><FormattedRelative value={`${comment.created}Z`} /></span>
            </div>
          }
          description={
            <div class="comment-body">
              <Body post={comment} />
              {showReplyForm && (
                <CommentReplyForm content={comment} closeForm={this.closeReplyForm} />
              )}

              {commentsChild[comment.id] && sortCommentsFromSteem(
                commentsChild[comment.id],
                commentsData,
                sortOrder
              ).map(commentId =>
                <CommentItem
                  {...this.props}
                  key={commentId}
                  comment={commentsData[commentId]}
                />
              )}
            </div>
          }
        />
      </List.Item>
    );
  }
}

export default withRouter(CommentItem);
