import React, { Component } from 'react'
import classNames from 'classnames'
import Dropzone from 'react-dropzone'
import styled from 'styled-components'
import { log } from 'ruucm-util'
import axios from 'axios'
import { endPoint } from '../shared/consts'

window.log = log

const getColor = props => {
  if (props.isDragReject) {
    return '#c66'
  }
  if (props.isDragActive) {
    return '#6c6'
  }
  return '#666'
}

const Container = styled.div`
  width: 200px;
  height: 200px;
  border-width: 2px;
  border-radius: 5px;
  border-color: ${props => getColor(props)};
  border-style: ${props =>
    props.isDragReject || props.isDragActive ? 'solid' : 'dashed'};
  background-color: ${props =>
    props.isDragReject || props.isDragActive ? '#eee' : ''};
`

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gitRepoUrl: 'https://github.com',
      liveUrl: 'https://netlify.com',
    }
  }

  onDrop(acceptedFiles, rejectedFiles) {
    acceptedFiles.forEach(file => {
      var formData = new FormData()
      formData.append('file', file)
      axios
        .post(endPoint + '/upload', formData)
        .then(res => {
          log('res', res)
          this.setState({
            gitRepoUrl: res.data.gitRepoUrl,
            liveUrl: res.data.liveUrl,
          })
        })
        .catch(error => {
          console.log(error)
        })
    })
  }

  render() {
    return (
      <div>
        <h1>
          gitRepoUrl :{' '}
          <a href={this.state.gitRepoUrl} target="_blank">
            {this.state.gitRepoUrl}
          </a>
        </h1>
        <h1>
          liveUrl :{' '}
          <a href={this.state.liveUrl} target="_blank">
            {this.state.liveUrl}
          </a>
        </h1>
        <Dropzone
          accept=".zip"
          onDrop={(acceptedFiles, rejectedFiles) =>
            this.onDrop(acceptedFiles, rejectedFiles)
          }
        >
          {({
            getRootProps,
            getInputProps,
            isDragActive,
            isDragAccept,
            isDragReject,
            acceptedFiles,
          }) => {
            return (
              <Container
                isDragActive={isDragActive}
                isDragReject={isDragReject}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {isDragAccept ? 'Drop' : 'Drag'} files here...
              </Container>
            )
          }}
        </Dropzone>
      </div>
    )
  }
}

export default App
