<?php
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="attestation-pix-20230224.pdf"');
header("Content-Length: " . filesize("attestation-pix-20230224.pdf"));
$fp = fopen("attestation-pix-20230224.pdf", "r");
fpassthru($fp);
fclose($fp);
?>
