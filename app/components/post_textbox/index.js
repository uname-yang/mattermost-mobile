// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {createPost} from 'mattermost-redux/actions/posts';
import {userTyping} from 'mattermost-redux/actions/websocket';

import {handleClearFiles, handleRemoveLastFile, handleUploadFiles} from 'app/actions/views/file_upload';
import {getTheme} from 'app/selectors/preferences';
import {canUploadFilesOnMobile} from 'mattermost-redux/selectors/entities/general';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';
import {getUsersTyping} from 'mattermost-redux/selectors/entities/typing';

import PostTextbox from './post_textbox';

function mapStateToProps(state, ownProps) {
    return {
        ...ownProps,
        canUploadFiles: canUploadFilesOnMobile(state),
        channelIsLoading: state.views.channel.loading,
        currentUserId: getCurrentUserId(state),
        typing: getUsersTyping(state),
        theme: getTheme(state),
        uploadFileRequestStatus: state.requests.files.uploadFiles.status
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            createPost,
            handleClearFiles,
            handleRemoveLastFile,
            handleUploadFiles,
            userTyping
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(PostTextbox);
