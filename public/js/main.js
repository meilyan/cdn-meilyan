document.addEventListener('DOMContentLoaded', () => {
  const dropArea = document.getElementById('drop-area');
  const fileElem = document.getElementById('fileElem');
  const fileElemTrigger = document.getElementById('fileElemTrigger');
  const gallery = document.getElementById('gallery');

  localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzE2MTI1NDc2fQ.SivKR0l5MnQmI2_s88x9SHesr-j0CrbunvWjen7jBVI')

  if (dropArea && fileElem && fileElemTrigger && gallery) {
      fileElemTrigger.addEventListener('click', (e) => {
          e.preventDefault();
          fileElem.click();
      });

      fileElem.addEventListener('change', handleFiles);

      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
          dropArea.addEventListener(eventName, preventDefaults, false);
      });

      ['dragenter', 'dragover'].forEach(eventName => {
          dropArea.addEventListener(eventName, () => dropArea.classList.add('dragover'), false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
          dropArea.addEventListener(eventName, () => dropArea.classList.remove('dragover'), false);
      });

      dropArea.addEventListener('drop', handleDrop, false);

      function preventDefaults(e) {
          e.preventDefault();
          e.stopPropagation();
      }

      function handleDrop(e) {
          const dt = e.dataTransfer;
          const files = dt.files;
          handleFiles({ target: { files } });
      }

      function handleFiles(e) {
          const files = e.target.files;
          [...files].forEach(uploadFile);
      }

      async function uploadFile(file) {
          const url = '/api/images/upload';
          const formData = new FormData();
          formData.append('image', file);

          const listItem = document.createElement('div');
          listItem.classList.add('list-item');

          const img = document.createElement('img');
          img.src = URL.createObjectURL(file);
          listItem.appendChild(img);

          const status = document.createElement('div');
          status.classList.add('status');
          status.textContent = 'Uploading...';
          listItem.appendChild(status);

          const progressBarContainer = document.createElement('div');
          progressBarContainer.classList.add('progress-bar-container');
          const progressBar = document.createElement('div');
          progressBar.classList.add('progress-bar');
          progressBarContainer.appendChild(progressBar);
          listItem.appendChild(progressBarContainer);

          gallery.appendChild(listItem);

          const token = localStorage.getItem('token');
          try {
              const response = await fetch(url, {
                  method: 'POST',
                  headers: {
                      Authorization: `Bearer ${token}`
                  },
                  body: formData
              });

              if (!response.ok) {
                  const errorDetails = await response.json();
                  console.error('Error details:', errorDetails);
                  status.textContent = 'Failed';
                  status.style.color = 'red';
              } else {
                  const result = await response.json();
                  status.textContent = 'Uploaded';
                  progressBar.style.width = '100%';
                  listItem.dataset.url = result.imageUrl;

                  listItem.addEventListener('click', () => {
                      navigator.clipboard.writeText(result.imageUrl).then(() => {
                          alert('URL copied to clipboard');
                      }).catch(err => {
                          console.error('Failed to copy: ', err);
                      });
                  });
              }
          } catch (error) {
              status.textContent = 'Failed';
              status.style.color = 'red';
              console.error('Error:', error);
          }
      }
  }
});
