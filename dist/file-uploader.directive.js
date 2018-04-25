angular
  .module('angularFineUploader')
  .directive('angularFineUploader', ['$timeout', function ($timeout) {

    function generateUploader($scope) {
      console.log($scope);
      return new qq.FineUploader({
        element: document.getElementById('fine-uploader-manual-trigger'),
        template: 'qq-template-manual-trigger',
        request: {
          endpoint: $scope.uploadServiceUrl
        },
        deleteFile: {
          enabled: true,
          method: "DELETE",
          endpoint: $scope.deleteFileServiceUrl
        },
        thumbnails: {
          placeholders: {
            waitingPath: '/dist/style/placeholders/waiting-generic.png',
            notAvailablePath: '/dist/style/placeholders/not_available-generic.png'
          }
        },
        validation: {
          allowedExtensions: $scope.uploaderExtensions,
          itemLimit: $scope.maxAllowedItems,
          sizeLimit: $scope.maxSizeKb * 1024
        },
        text: {
          defaultResponseError: 'errrr',
          fileInputTitle: 'tt',
          formatProgress: 'ggg',
          waitingForResponse: "This is the place!",
        },        
        callbacks: {
          onComplete: $scope.onSuccessUploadCallback
        },
        autoUpload: false,
        debug: false
      });
    }

    return {
      restrict: "EA",
      scope: {
        uploadServiceUrl: '@',
        deleteFileServiceUrl: '@',
        maxSizeKb: '@',
        maxAllowedItems: '@',
        allowedExtensions: '@',
        onSuccessUploadCallback: '&'
      },
      templateUrl: './file-uploader.directive.html',

      link: function ($scope, element, attrs) {

        $scope.uploaderExtensions = ($scope.allowedExtensions) ? $scope.allowedExtensions.split(',') : ['*'];
        $scope.maxSizeKb = $scope.maxSizeKb || 0;
        $scope.maxAllowedItems = $scope.maxAllowedItems || 0;

        $scope.uploader = generateUploader($scope);

        $scope.uploader.status = {
          SUBMITTING: "submitting",
          SUBMITTED: "submitted",
          REJECTED: "rejected",
          QUEUED: "queued",
          CANCELED: "canceled",
          PAUSED: "paused",
          UPLOADING: "uploading",
          UPLOAD_FINALIZING: "upload finalizing",
          UPLOAD_RETRYING: "retrying upload",
          UPLOAD_SUCCESSFUL: "upload successful 1111",
          UPLOAD_FAILED: "upload failed",
          DELETE_FAILED: "delete failed",
          DELETING: "deleting",
          DELETED: "deleted"
      };
          

        qq(document.getElementById("trigger-upload")).attach("click", function () {
          $scope.uploader.uploadStoredFiles();
        });
      }
    }
  }]);
